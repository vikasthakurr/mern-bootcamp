/**
 * ForgeTest — a tiny test framework built from scratch.
 * Demonstrates closures (registry + expect), objects (matchers, results),
 * and functional style (callbacks, higher-order matchers, map/filter/reduce).
 * ESM module — runs in the browser and in Node.
 */

const deepEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return a !== a && b !== b; // both NaN
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => deepEqual(a[key], b[key]));
};

const format = (value) => {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "function") return value.name ? `[Function ${value.name}]` : "[Function]";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

// Each matcher is a pure function: (actual, expected) => { pass, message }.
const matchers = {
  toBe: (actual, expected) => ({
    pass: Object.is(actual, expected),
    message: `expected ${format(actual)} to be ${format(expected)} (strict ===)`,
  }),
  toEqual: (actual, expected) => ({
    pass: deepEqual(actual, expected),
    message: `expected ${format(actual)} to deeply equal ${format(expected)}`,
  }),
  toBeTruthy: (actual) => ({
    pass: Boolean(actual),
    message: `expected ${format(actual)} to be truthy`,
  }),
  toBeFalsy: (actual) => ({
    pass: !actual,
    message: `expected ${format(actual)} to be falsy`,
  }),
  toBeGreaterThan: (actual, expected) => ({
    pass: actual > expected,
    message: `expected ${format(actual)} to be greater than ${format(expected)}`,
  }),
  toBeLessThan: (actual, expected) => ({
    pass: actual < expected,
    message: `expected ${format(actual)} to be less than ${format(expected)}`,
  }),
  toContain: (actual, expected) => ({
    pass: Array.isArray(actual) || typeof actual === "string"
      ? actual.includes(expected)
      : false,
    message: `expected ${format(actual)} to contain ${format(expected)}`,
  }),
  toThrow: (actual) => {
    let threw = false;
    let thrownMessage = "";
    if (typeof actual === "function") {
      try {
        actual();
      } catch (err) {
        threw = true;
        thrownMessage = err && err.message ? err.message : String(err);
      }
    }
    return {
      pass: threw,
      message: threw
        ? `function threw as expected: ${thrownMessage}`
        : `expected function to throw, but it did not`,
    };
  },
};

// Builds the fluent assertion object; each method closes over `actual`.
function makeExpectation(actual, recordAssertion, negated = false) {
  const api = Object.keys(matchers).reduce((chain, name) => {
    chain[name] = (...args) => {
      const result = matchers[name](actual, ...args);
      const pass = negated ? !result.pass : result.pass;
      const message = negated
        ? result.message.replace(/^expected /, "expected not ")
        : result.message;

      recordAssertion({ pass, message });

      if (!pass) throw new AssertionError(message);
      return chain;
    };
    return chain;
  }, {});

  Object.defineProperty(api, "not", {
    get() {
      return makeExpectation(actual, recordAssertion, !negated);
    },
  });

  return api;
}

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}

// Suite/test state lives in this closure — nothing leaks to globals.
function createForge() {
  const suites = [];
  let currentSuite = null;

  function describe(name, fn) {
    const suite = { name, tests: [] };
    const previous = currentSuite;
    currentSuite = suite;
    fn();
    currentSuite = previous;
    suites.push(suite);
  }

  function it(name, fn) {
    const target = currentSuite || fallbackSuite();
    target.tests.push({ name, fn });
  }

  let looseSuite = null;
  function fallbackSuite() {
    if (!looseSuite) {
      looseSuite = { name: "(top level)", tests: [] };
      suites.push(looseSuite);
    }
    return looseSuite;
  }

  function run() {
    const suiteReports = suites.map((suite) => {
      const testReports = suite.tests.map((test) => runOneTest(test));
      return {
        name: suite.name,
        tests: testReports,
        passed: testReports.filter((t) => t.pass).length,
        failed: testReports.filter((t) => !t.pass).length,
      };
    });

    const totals = suiteReports.reduce(
      (acc, s) => ({
        passed: acc.passed + s.passed,
        failed: acc.failed + s.failed,
        total: acc.total + s.tests.length,
      }),
      { passed: 0, failed: 0, total: 0 }
    );

    return { suites: suiteReports, totals };
  }

  // Each test gets its own assertions array so tests stay isolated.
  function runOneTest(test) {
    const assertions = [];
    const recordAssertion = (a) => assertions.push(a);

    let pass = true;
    let error = null;
    const started = now();

    try {
      const expect = (actual) => makeExpectation(actual, recordAssertion);
      test.fn(expect);
    } catch (err) {
      pass = false;
      error = err instanceof AssertionError ? err.message : `threw: ${err.message}`;
    }

    if (assertions.some((a) => !a.pass)) pass = false;

    return {
      name: test.name,
      pass,
      error,
      assertions,
      durationMs: Math.max(0, now() - started),
    };
  }

  return { describe, it, run };
}

function now() {
  if (typeof performance !== "undefined" && performance.now) return performance.now();
  return Date.now();
}

const ForgeTest = { createForge, matchers, deepEqual, AssertionError };

export { createForge, matchers, deepEqual, AssertionError };
export default ForgeTest;
