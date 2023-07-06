export function omit<T, K extends keyof T>(obj: T, props: K[]): Omit<T, K> {
  const newObj = { ...obj };
  for (const prop of props) {
    delete newObj[prop];
  }
  return newObj;
}

export function pick<T, K extends keyof T>(obj: T, props: K[]): Pick<T, K> {
  const newObj = {} as Pick<T, K>;
  for (const prop of props) {
    newObj[prop] = obj[prop];
  }
  return newObj;
}
