# Build order for the live session

subject.js → forge.js (expect → describe/it → runAll) → specs.js → run.js → index.html / runner.js / style.css

## Why this order

1. subject.js — the small functions we want to test (closures live here).
2. forge.js — the framework: expect() first, then describe/it, then runAll().
3. specs.js — write real tests and prove the framework works.
4. run.js — run in the terminal: node run.js
5. browser UI — index.html + runner.js + style.css just display the output.

## The 3 ideas to point out

- Closures — expect(actual) remembers "actual"; makeCounter() hides "count".
- Objects — expect() returns an object of check methods; results are plain objects.
- Functional — describe/it take callbacks; runAll() uses map / filter / reduce.
