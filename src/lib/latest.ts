/**
 * Keeps out-of-order responses from overwriting newer ones: a slider or toggle calls `begin()`
 * before each fetch and applies the response only if `isLatest(token)` still holds.
 */
export function createLatestGate(): { begin(): number; isLatest(token: number): boolean } {
  let newest = -1;
  return {
    begin: () => ++newest,
    isLatest: (token) => token === newest,
  };
}
