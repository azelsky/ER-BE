export function omit<T, K extends keyof T>(obj: T, props: K[]): Omit<T, K> {
  const newObj = { ...obj };
  for (const prop of props) {
    delete newObj[prop];
  }
  return newObj;
}

export function generateRandomNumberCode(length: number): number {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // Generates a random number between 0 and 9
  }
  return +result;
}
