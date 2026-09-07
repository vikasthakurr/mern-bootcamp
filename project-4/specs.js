// specs.js — example tests written with ForgeTest.
// A couple of tests fail on purpose so the runner shows red alongside green.

import {
  add,
  multiply,
  scaleBy,
  pipe,
  sum,
  evens,
  makeCounter,
  divide,
} from "./subject.js";

export function registerSpecs(forge) {
  const { describe, it } = forge;

  describe("arithmetic", () => {
    it("adds two numbers", (expect) => {
      expect(add(2, 3)).toBe(5);
    });

    it("multiplies two numbers", (expect) => {
      expect(multiply(4, 5)).toBe(20);
    });

    it("FAILS on purpose: 2 + 2 should not be 5", (expect) => {
      expect(add(2, 2)).toBe(5);
    });
  });

  describe("closures", () => {
    it("scaleBy remembers its factor", (expect) => {
      const triple = scaleBy(3);
      expect(triple(10)).toBe(30);
      expect(triple(7)).toBe(21);
    });

    it("counter keeps private state across calls", (expect) => {
      const counter = makeCounter(10);
      counter.increment();
      counter.increment();
      counter.decrement();
      expect(counter.value()).toBe(11);
    });

    it("two counters do not share state", (expect) => {
      const a = makeCounter();
      const b = makeCounter();
      a.increment();
      a.increment();
      b.increment();
      expect(a.value()).toBe(2);
      expect(b.value()).toBe(1);
    });
  });

  describe("functional helpers", () => {
    it("sum reduces an array", (expect) => {
      expect(sum([1, 2, 3, 4])).toBe(10);
    });

    it("evens filters an array", (expect) => {
      expect(evens([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
    });

    it("pipe composes functions left to right", (expect) => {
      const transform = pipe(
        (n) => n + 1,
        (n) => n * 2,
        (n) => n - 3
      );
      expect(transform(5)).toBe(9);
    });
  });

  describe("matchers showcase", () => {
    it("supports .not negation", (expect) => {
      expect(add(1, 1)).not.toBe(3);
    });

    it("toContain works on arrays and strings", (expect) => {
      expect([1, 2, 3]).toContain(2);
      expect("forge-test").toContain("test");
    });

    it("toThrow catches thrown errors", (expect) => {
      expect(() => divide(10, 0)).toThrow();
    });

    it("comparison matchers", (expect) => {
      expect(10).toBeGreaterThan(3);
      expect(3).toBeLessThan(10);
    });

    it("FAILS on purpose: throwing where none expected", (expect) => {
      expect(() => divide(10, 2)).toThrow();
    });
  });
}
