# ForgeTest — Build Your Own Test Framework

A tiny, dependency-free JavaScript test framework built from scratch. It works in the browser (with a live runner UI) and in Node (as a CLI), and it exists to make three core concepts concrete:

- **Closures** — functions that carry private state with them.
- **Objects** — modeling matchers, results, and suites as plain objects.
- **Functional programming** — functions as data, higher-order functions, and `map`/`filter`/`reduce` for reporting.

If you've used Jest or Mocha, the API will feel familiar: `describe`, `it`, and `expect(...).toBe(...)`.

---

## Quick start

### In the browser

Open `index.html` in a browser (or serve the folder). Tests run automatically on load. You'll see a summary, per-suite results, and a "show failures only" toggle. The same report is also logged to the console.

Because the files are ES modules, some browsers block `import` over the `file://` protocol. If you see a blank page, serve the folder over HTTP:

```bash
# any static server works, for example:
npx serve .
# then open the printed localhost URL
```

### In Node

```bash
node run.js
# or
npm test
```

The CLI prints colorized results and exits with code `1` if any test fails, which makes it CI-friendly.

> The example suite intentionally includes **two failing tests** so you can see red next to green.

---

## Files

| File          | Role                                                                 |
| ------------- | -------------------------------------------------------------------- |
| `forge.js`    | The framework itself: registry, `expect`, matchers, runner.          |
| `subject.js`  | The "code under test" — small functions to assert against.           |
| `specs.js`    | Example tests written with ForgeTest (`registerSpecs(forge)`).       |
| `runner.js`   | Browser entry point: runs specs and paints results to the DOM.       |
| `run.js`      | Node CLI entry point: runs the same specs and prints ANSI output.    |
| `index.html`  | The browser runner UI.                                               |
| `style.css`   | Dark-theme styling for the UI.                                       |

---

## Writing a test

```js
import { createForge } from "./forge.js";

const forge = createForge();
const { describe, it } = forge;

describe("math", () => {
  it("adds numbers", (expect) => {
    expect(2 + 3).toBe(5);
  });
});

const report = forge.run();
console.log(report.totals); // { passed, failed, total }
```

Notice `expect` is passed **into** each `it` callback. That keeps every test's
assertions isolated (see "Closures" below) and avoids any shared global state.

### Available matchers

| Matcher                     | Passes when …                                  |
| --------------------------- | ---------------------------------------------- |
| `toBe(expected)`            | `Object.is(actual, expected)` (strict)         |
| `toEqual(expected)`         | deep structural equality                       |
| `toBeTruthy()`              | value is truthy                                |
| `toBeFalsy()`               | value is falsy                                 |
| `toBeGreaterThan(n)`        | `actual > n`                                   |
| `toBeLessThan(n)`           | `actual < n`                                   |
| `toContain(item)`           | array/string includes `item`                   |
| `toThrow()`                 | the given function throws when called          |

Every matcher can be negated with `.not`:

```js
expect(add(1, 1)).not.toBe(3);
```

---

## How the three concepts show up

### 1. Closures

- **`expect(actual)`** returns an object whose methods close over `actual`. You
  never pass the value again — the closure remembers it. The `.not` chain closes
  over a `negated` flag too.
- **The registry** inside `createForge()` keeps `suites` and `currentSuite` as
  private variables. Only the returned `describe`, `it`, and `run` can touch
  them — there is no global mutable state.
- **Each test** gets its own `assertions` array via a `recordAssertion` closure,
  so tests never interfere with one another.
- **`makeCounter()`** in `subject.js` is the textbook example: a private `count`
  that only the returned methods can read or change.

### 2. Objects

- **Matchers** live in a `matchers` object keyed by name, so they're easy to look
  up and extend.
- **Reports** are structured objects: a test result is
  `{ name, pass, error, assertions, durationMs }`, and `run()` returns
  `{ suites, totals }`.

### 3. Functional programming

- **`describe`/`it` take callbacks** — functions passed as data and called to
  register tests.
- **Matchers are higher-order**: `(actual, expected) => ({ pass, message })`.
  `scaleBy(factor)` in `subject.js` returns a new function, and `pipe(...fns)`
  composes functions.
- **Reporting uses `map`/`filter`/`reduce`**: suites are mapped to reports,
  passes/failures are counted with `filter`, and grand totals are computed with
  `reduce`. The browser UI builds its markup with `map(...).join("")`.

---

## Extending it

Add a matcher by dropping a new entry into the `matchers` object in `forge.js`:

```js
toBeCloseTo: (actual, expected, precision = 2) => ({
  pass: Math.abs(actual - expected) < Math.pow(10, -precision) / 2,
  message: `expected ${actual} to be close to ${expected}`,
}),
```

It immediately becomes available as `expect(x).toBeCloseTo(y)` and
`expect(x).not.toBeCloseTo(y)` — the `expect` builder generates one method per
matcher automatically.

---

## License

MIT — learn from it, break it, rebuild it.
