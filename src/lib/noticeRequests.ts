/** Owns one in-memory extraction request; cancelled/replaced responses cannot change the draft. */
export class NoticeRequests {
  private current: AbortController | null = null;
  begin(): AbortController {
    this.cancel();
    this.current = new AbortController();
    return this.current;
  }
  cancel(): void {
    this.current?.abort();
    this.current = null;
  }
  isCurrent(controller: AbortController): boolean {
    return this.current === controller && !controller.signal.aborted;
  }
  finish(controller: AbortController): void {
    if (this.current === controller) this.current = null;
  }
}
