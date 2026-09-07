// subject.js — the code under test for the example specs.

export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;

export const scaleBy = (factor) => (n) => n * factor;

export const pipe = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input);

export const sum = (nums) => nums.reduce((acc, n) => acc + n, 0);
export const evens = (nums) => nums.filter((n) => n % 2 === 0);

// Closure-based counter: `count` is private to the returned methods.
export function makeCounter(start = 0) {
  let count = start;
  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    value() {
      return count;
    },
  };
}

export function divide(a, b) {
  if (b === 0) throw new Error("cannot divide by zero");
  return a / b;
}
