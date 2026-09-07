// runner.js — browser entry point. Runs the specs and renders results.

import { createForge } from "./forge.js";
import { registerSpecs } from "./specs.js";

const els = {
  runBtn: document.getElementById("runBtn"),
  failsOnly: document.getElementById("failsOnly"),
  summary: document.getElementById("summary"),
  statTotal: document.getElementById("statTotal"),
  statPass: document.getElementById("statPass"),
  statFail: document.getElementById("statFail"),
  statTime: document.getElementById("statTime"),
  results: document.getElementById("results"),
};

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
  );

// Cached so the "failures only" toggle can re-render without re-running.
let lastReport = null;

function runTests() {
  const forge = createForge();
  registerSpecs(forge);

  const started = performance.now();
  const report = forge.run();
  const wallMs = performance.now() - started;

  lastReport = { ...report, wallMs };
  render(lastReport);
  logToConsole(lastReport);
}

function render(report) {
  const { totals, suites, wallMs } = report;

  els.summary.classList.remove("hidden");
  els.statTotal.textContent = totals.total;
  els.statPass.textContent = totals.passed;
  els.statFail.textContent = totals.failed;
  els.statTime.innerHTML = `${wallMs.toFixed(1)}<small>ms</small>`;

  els.summary.classList.toggle("all-pass", totals.failed === 0);
  els.summary.classList.toggle("has-fail", totals.failed > 0);

  const failsOnly = els.failsOnly.checked;

  els.results.innerHTML = suites
    .map((suite) => renderSuite(suite, failsOnly))
    .filter(Boolean)
    .join("");
}

function renderSuite(suite, failsOnly) {
  const tests = failsOnly ? suite.tests.filter((t) => !t.pass) : suite.tests;
  if (tests.length === 0) return "";

  const testRows = tests.map(renderTest).join("");
  const status = suite.failed > 0 ? "suite-fail" : "suite-pass";

  return `
    <section class="suite ${status}">
      <header class="suite-head">
        <span class="suite-name">${escapeHtml(suite.name)}</span>
        <span class="suite-tally">
          <span class="pill pill-pass">${suite.passed} passed</span>
          ${suite.failed > 0 ? `<span class="pill pill-fail">${suite.failed} failed</span>` : ""}
        </span>
      </header>
      <ul class="test-list">${testRows}</ul>
    </section>
  `;
}

function renderTest(test) {
  const icon = test.pass ? "✔" : "✕";
  const cls = test.pass ? "test-pass" : "test-fail";
  const detail = !test.pass && test.error
    ? `<div class="test-error">${escapeHtml(test.error)}</div>`
    : "";

  return `
    <li class="test ${cls}">
      <span class="test-icon" aria-hidden="true">${icon}</span>
      <span class="test-name">${escapeHtml(test.name)}</span>
      <span class="test-time">${test.durationMs.toFixed(2)}ms</span>
      ${detail}
    </li>
  `;
}

function logToConsole(report) {
  const { totals } = report;
  report.suites.forEach((suite) => {
    console.groupCollapsed(
      `%c${suite.name} — ${suite.passed}/${suite.tests.length} passed`,
      suite.failed ? "color:#ff6b6b" : "color:#4ade80"
    );
    suite.tests.forEach((t) => {
      const style = t.pass ? "color:#4ade80" : "color:#ff6b6b";
      console.log(`%c${t.pass ? "PASS" : "FAIL"} ${t.name}`, style);
      if (!t.pass && t.error) console.log(`      ↳ ${t.error}`);
    });
    console.groupEnd();
  });
  console.log(
    `%cForgeTest: ${totals.passed}/${totals.total} passed, ${totals.failed} failed`,
    "font-weight:bold"
  );
}

els.runBtn.addEventListener("click", runTests);
els.failsOnly.addEventListener("change", () => {
  if (lastReport) render(lastReport);
});

runTests();
