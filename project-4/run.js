// run.js — Node CLI runner. `node run.js` or `npm test`.
// Prints colorized results and exits non-zero when any test fails.

import { createForge } from "./forge.js";
import { registerSpecs } from "./specs.js";

const color = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

const forge = createForge();
registerSpecs(forge);

const report = forge.run();

console.log("");
console.log(color.bold(color.cyan("ForgeTest")));
console.log("");

report.suites.forEach((suite) => {
  const head = suite.failed > 0 ? color.red(suite.name) : color.green(suite.name);
  console.log(`  ${head} ${color.dim(`(${suite.passed}/${suite.tests.length})`)}`);

  suite.tests.forEach((t) => {
    const mark = t.pass ? color.green("✔") : color.red("✕");
    const time = color.dim(`${t.durationMs.toFixed(2)}ms`);
    console.log(`    ${mark} ${t.name} ${time}`);
    if (!t.pass && t.error) {
      console.log(`        ${color.red("↳ " + t.error)}`);
    }
  });
  console.log("");
});

const { passed, failed, total } = report.totals;
const summary = `${passed}/${total} passed, ${failed} failed`;
console.log(failed > 0 ? color.red(color.bold(summary)) : color.green(color.bold(summary)));
console.log("");

process.exit(failed > 0 ? 1 : 0);
