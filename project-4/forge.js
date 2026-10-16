// forge.js — a tiny test framework built from scratch.
// Shows three ideas: closures, objects, and functional programming (map/filter/reduce).

// A list that holds all the test suites. It is private to this file.
const suites = [];
let currentSuite = null;

// describe() groups related tests together.
// The callback (fn) is a function passed as data — that's functional programming.
export function describe(name, fn) {
  currentSuite = { name: name, tests: [] };
  suites.push(currentSuite);
  fn(); // run the callback so the it() calls inside register their tests
}

// it() registers one test inside the current suite.
export function it(name, fn) {
  currentSuite.tests.push({ name: name, fn: fn });
}

// expect() returns an object of checks. Each check "remembers" actual — that's a closure.
export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(
          "expected " + show(actual) + " to be " + show(expected),
        );
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          "expected " + show(actual) + " to equal " + show(expected),
        );
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error("expected " + show(actual) + " to be truthy");
      }
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        throw new Error(
          "expected " + show(actual) + " to be greater than " + show(expected),
        );
      }
    },
    toContain(item) {
      if (!actual.includes(item)) {
        throw new Error(
          "expected " + show(actual) + " to contain " + show(item),
        );
      }
    },
    toThrow() {
      let threw = false;
      try {
        actual(); // actual is a function here; call it to see if it throws
      } catch (e) {
        threw = true;
      }
      if (!threw) {
        throw new Error("expected function to throw, but it did not");
      }
    },
  };
}

// runAll() runs every test and builds a plain report object.
// It uses map, filter, and reduce — the functional programming part.
export function runAll() {
  const suiteReports = suites.map(function (suite) {
    const tests = suite.tests.map(runOneTest);
    return {
      name: suite.name,
      tests: tests,
      passed: tests.filter((t) => t.pass).length,
      failed: tests.filter((t) => !t.pass).length,
    };
  });

  const totals = suiteReports.reduce(
    function (acc, suite) {
      return {
        passed: acc.passed + suite.passed,
        failed: acc.failed + suite.failed,
        total: acc.total + suite.tests.length,
      };
    },
    { passed: 0, failed: 0, total: 0 },
  );

  return { suites: suiteReports, totals: totals };
}

// Runs a single test and returns a result object.
function runOneTest(test) {
  let pass = true;
  let error = null;

  try {
    test.fn(); // the test uses expect() inside; if a check fails it throws
  } catch (e) {
    pass = false;
    error = e.message;
  }

  return { name: test.name, pass: pass, error: error };
}

// Helper to print values nicely in error messages.
function show(value) {
  if (typeof value === "string") return '"' + value + '"';
  if (typeof value === "function") return "[function]";
  return JSON.stringify(value);
}
