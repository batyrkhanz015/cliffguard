import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Footer } from '../Footer';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));

describe('Footer', () => {
  it('reads exactly the required line', () => {
    const text = renderToStaticMarkup(<Footer />).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    expect(text).toBe('Education, not tax advice. Rules as of Nov 2026. Delete my data.');
  });
});
