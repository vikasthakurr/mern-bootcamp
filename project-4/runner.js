// runner.js — runs the tests and shows the results on the page.

import { runAll } from "./forge.js";
import "./specs.js"; // importing the file registers all the tests

const summaryEl = document.getElementById("summary");
const resultsEl = document.getElementById("results");

function showResults() {
  const report = runAll();

  // Summary line at the top.
  const { passed, failed, total } = report.totals;
  summaryEl.textContent = `${passed}/${total} passed, ${failed} failed`;
  summaryEl.className = failed > 0 ? "summary has-fail" : "summary all-pass";

  // One block per suite, one row per test.
  resultsEl.innerHTML = report.suites
    .map((suite) => {
      const rows = suite.tests
        .map((test) => {
          if (test.pass) {
            return `<li class="test test-pass">✔ ${test.name}</li>`;
          }
          return `<li class="test test-fail">✕ ${test.name}
            <div class="test-error">${test.error}</div></li>`;
        })
        .join("");

      return `
        <section class="suite">
          <h2 class="suite-name">${suite.name}</h2>
          <ul class="test-list">${rows}</ul>
        </section>
      `;
    })
    .join("");
}

document.getElementById("runBtn").addEventListener("click", showResults);

// Run once when the page loads.
showResults();
