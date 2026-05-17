export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = globalThis.setTimeout(() => resolve(fallback), ms);

    promise
      .then((value) => {
        globalThis.clearTimeout(timer);
        resolve(value);
      })
      .catch(() => {
        globalThis.clearTimeout(timer);
        resolve(fallback);
      });
  });
}
