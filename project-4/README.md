# ForgeTest — Build Your Own Test Framework

A tiny, dependency-free JavaScript test framework built from scratch. It runs in
the browser (with a simple runner UI) and in Node (as a CLI). It exists to make
three core concepts concrete:

- **Closures** — functions that remember private values.
- **Objects** — modeling checks and results as plain objects.
- **Functional programming** — functions as data, and `map` / `filter` / `reduce` for the report.

If you've used Jest or Mocha, the API will feel familiar: `describe`, `it`, and `expect(...).toBe(...)`.

---

## Quick start

### In Node

```bash
node run.js
# or
npm test
```

It prints the results and exits with code `1` if any test fails.

### In the browser

Open `index.html` in a browser (or serve the folder). Tests run on load and the
results show on the page. Because the files are ES modules, some browsers block
`import` over `file://`, so serve the folder over HTTP if you see a blank page:

```bash
npx serve .
# then open the printed localhost URL
```

> The example suite includes **one failing test on purpose** so you can see red next to green.

---

## Files

| File         | Role                                                               |
| ------------ | ------------------------------------------------------------------ |
| `forge.js`   | The framework: `describe`, `it`, `expect`, and `runAll`.           |
| `subject.js` | The functions we test — `add`, `scaleBy`, `makeCounter`, etc.      |
| `specs.js`   | Example tests written with ForgeTest.                              |
| `run.js`     | Node CLI entry point.                                              |
| `runner.js`  | Browser entry point: runs the tests and shows results on the page. |
| `index.html` | The browser runner UI.                                             |
| `style.css`  | Styling for the UI.                                                |

---

## Writing a test

```js
import { describe, it, expect } from "./forge.js";

describe("math", () => {
  it("adds numbers", () => {
    expect(2 + 3).toBe(5);
  });
});
```

Then import the specs and call `runAll()` (this is what `run.js` and `runner.js` do).

### Available matchers

| Matcher              | Passes when …                         |
| -------------------- | ------------------------------------- |
| `toBe(expected)`     | `actual === expected`                 |
| `toEqual(expected)`  | values are equal (compared as JSON)   |
| `toBeTruthy()`       | value is truthy                       |
| `toBeGreaterThan(n)` | `actual > n`                          |
| `toContain(item)`    | array or string includes `item`       |
| `toThrow()`          | the given function throws when called |

---

## How the three concepts show up

### 1. Closures

- `expect(actual)` returns an object whose methods remember `actual`. You never pass it again.
- `makeCounter()` in `subject.js` keeps a private `count` that only its methods can change.

### 2. Objects

- `expect()` returns a plain object of check methods.
- Each test result is a plain object: `{ name, pass, error }`, and `runAll()` returns `{ suites, totals }`.

### 3. Functional programming

- `describe` and `it` take callbacks — functions passed as data.
- `runAll()` builds the report with `map` (suites to reports), `filter` (count pass/fail), and `reduce` (grand totals).

---

## License

MIT — learn from it, break it, rebuild it.
