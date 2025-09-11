import * as assert from 'node:assert'

export const assertApproxEqual = (
  a: number,
  b: number,
  message: string,
  approx: number = 0.01
) => {
  if (Math.abs((a - b) / a) < approx) {
    return true;
  } else {
    throw new assert.AssertionError({ message })
  }
};

export const assertSetEqual = <T>(set1: Set<T>, set2: Set<T>, message: string) => {
  if (set1.size !== set2.size) {
    throw new assert.AssertionError({ message })
  }
  for (const item of set1) {
    if (!set2.has(item)) {
      throw new assert.AssertionError({ message })
    }
  }
  return true;
};

export const assertMapEqual = <K, V>(map1: Map<K, V>, map2: Map<K, V>, message: string) => {
  if (map1.size !== map2.size) {
    throw new assert.AssertionError({ message })
  }
  for (const [key, value] of map1) {
    if (!map2.has(key) || map2.get(key) !== value) {
      throw new assert.AssertionError({ message })
    }
  }
  return true;
};
