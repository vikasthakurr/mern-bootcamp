// subject.js — the small functions we want to test.

// Simple functions.
export function add(a, b) {
  return a + b;
}

export function sum(numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

export function evens(numbers) {
  return numbers.filter((n) => n % 2 === 0);
}

// scaleBy returns a new function that remembers "factor" — a closure.
export function scaleBy(factor) {
  return function (n) {
    return n * factor;
  };
}

// makeCounter keeps "count" private. Only the returned methods can change it — a closure.
export function makeCounter(start = 0) {
  let count = start;
  return {
    increment() {
      count = count + 1;
      return count;
    },
    decrement() {
      count = count - 1;
      return count;
    },
    value() {
      return count;
    },
  };
}

// divide throws when you divide by zero — used to show toThrow().
export function divide(a, b) {
  if (b === 0) {
    throw new Error("cannot divide by zero");
  }
  return a / b;
}
