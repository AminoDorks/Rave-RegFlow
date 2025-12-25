export const pool = async <T>(
  props: T[],
  callback: (arg: T) => Promise<void>,
  maxConcurrency: number,
) => {
  const queue = [...props];
  const promises: Promise<void>[] = [];

  for (let i = 0; i < Math.min(maxConcurrency, props.length); i++) {
    const worker = async () => {
      while (queue.length > 0) {
        const prop = queue.shift();
        if (prop != undefined) {
          await callback(prop);
        }
      }
    };
    promises.push(worker());
  }

  await Promise.all(promises);
};
