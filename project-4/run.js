// run.js — run the tests in the terminal with:  node run.js

import { runAll } from "./forge.js";
import "./specs.js"; // importing the file registers all the tests

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;

const report = runAll();

console.log("");
report.suites.forEach((suite) => {
  console.log(suite.name);
  suite.tests.forEach((test) => {
    if (test.pass) {
      console.log("  " + green("PASS") + " " + test.name);
    } else {
      console.log("  " + red("FAIL") + " " + test.name);
      console.log("       " + red(test.error));
    }
  });
  console.log("");
});

const { passed, failed, total } = report.totals;
const summary = `${passed}/${total} passed, ${failed} failed`;
console.log(failed > 0 ? red(summary) : green(summary));
console.log("");

process.exit(failed > 0 ? 1 : 0);
