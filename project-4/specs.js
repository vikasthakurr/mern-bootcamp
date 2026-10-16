// specs.js — example tests written with our framework.
// One test fails on purpose so students see red next to green.

import { describe, it, expect } from "./forge.js";
import { add, sum, evens, scaleBy, makeCounter, divide } from "./subject.js";

describe("arithmetic", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("sums an array", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it("FAILS on purpose: 2 + 2 is not 5", () => {
    expect(add(2, 2)).toBe(5);
  });
});

describe("closures", () => {
  it("scaleBy remembers its factor", () => {
    const triple = scaleBy(3);
    expect(triple(10)).toBe(30);
  });

  it("counter keeps its own private count", () => {
    const counter = makeCounter(10);
    counter.increment();
    counter.increment();
    counter.decrement();
    expect(counter.value()).toBe(11);
  });

  it("two counters do not share state", () => {
    const a = makeCounter();
    const b = makeCounter();
    a.increment();
    a.increment();
    b.increment();
    expect(a.value()).toBe(2);
    expect(b.value()).toBe(1);
  });
});

describe("more matchers", () => {
  it("evens filters an array", () => {
    expect(evens([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
  });

  it("toContain works on arrays", () => {
    expect([1, 2, 3]).toContain(2);
  });

  it("toThrow catches errors", () => {
    expect(() => divide(10, 0)).toThrow();
  });

  it("comparison matcher", () => {
    expect(10).toBeGreaterThan(3);
  });
});
