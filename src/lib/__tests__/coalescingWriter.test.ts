import { describe, expect, it } from 'vitest';
import { createCoalescingWriter } from '../coalescingWriter';

function deferredWrites() {
  const started: string[] = [];
  const releases: Array<() => void> = [];
  let active = 0;
  let maxActive = 0;
  const write = (value: string) =>
    new Promise<void>((resolve) => {
      started.push(value);
      active += 1;
      maxActive = Math.max(maxActive, active);
      releases.push(() => {
        active -= 1;
        resolve();
      });
    });
  return { started, releases, write, maxActive: () => maxActive };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('createCoalescingWriter', () => {
  it('turns three rapid changes into two sequential writes, the last carrying the final state', async () => {
    const log = deferredWrites();
    const writer = createCoalescingWriter(log.write);

    writer.submit('A');
    writer.submit('B');
    writer.submit('C');
    expect(log.started).toEqual(['A']);

    log.releases[0]();
    await flush();
    expect(log.started).toEqual(['A', 'C']);

    log.releases[1]();
    await flush();
    expect(log.started).toEqual(['A', 'C']);
    expect(log.maxActive()).toBe(1);
  });

  it('writes again once idle', async () => {
    const log = deferredWrites();
    const writer = createCoalescingWriter(log.write);
    writer.submit('A');
    log.releases[0]();
    await flush();

    writer.submit('B');
    expect(log.started).toEqual(['A', 'B']);
  });

  it('keeps going after a failed write', async () => {
    const written: string[] = [];
    const writer = createCoalescingWriter(async (value: string) => {
      written.push(value);
      if (value === 'A') throw new Error('network');
    });
    writer.submit('A');
    await flush();
    writer.submit('B');
    await flush();

    expect(written).toEqual(['A', 'B']);
  });
});
