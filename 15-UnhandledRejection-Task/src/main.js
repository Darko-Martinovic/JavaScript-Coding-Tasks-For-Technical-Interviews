// =============================================================================
// TASK 15 — Fire-and-Forget .then() Chain
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (console fills with "unhandled rejection"; UI gaps)
//
// On load the page kicks off three pieces of async work:
//   - `prewarmCache()` — fire-and-forget, but its rejection is "logged"
//     somewhere none of us can see.
//   - `getConfig()` — awaited improperly inside a non-async function.
//   - `report()` — chains `.then` but never `.catch` and silently
//     swallows the result of an inner Promise.
//
// THINGS TO SCRUTINISE:
//   1. `prewarmCache()` — no handler at all. What does the browser do
//      with an unhandled rejection? Where is it visible?
//   2. `function syncReader()` contains `const value = await getConfig()`.
//      Does that compile? What does it return?
//   3. `.then((r) => r.fetch())` — what does the OUTER promise resolve
//      to if the inner Promise is not RETURNED out of the callback?
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - "Config:" displays { theme: "dark" }.
//   - "Report:" displays a number (the fetched payload's length).
//   - The console has NO `unhandled rejection` warnings.
//
// ACTUAL (buggy) BEHAVIOR: "Config:" never populates; "Report:" shows
//   `undefined`; and the console logs an unhandled rejection from the
//   prewarmCache call.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Boot</h1>
    <p>Config: <span id="config"></span></p>
    <p>Report: <span id="report"></span></p>
  </main>
`;

function prewarmCache() {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('warm fail')), 50));
}

function getConfig() {
  return new Promise((resolve) => setTimeout(() => resolve({ theme: 'dark' }), 60));
}

function fetchPayload() {
  return new Promise((resolve) => setTimeout(() => resolve('hello'), 30));
}

// BUG 1: fire-and-forget. No .catch — the rejection becomes an
//        "unhandledrejection" event.
prewarmCache();

// BUG 2: `function` (not `async function`). `await` is a syntax error in
//        a plain function — but with a `.then` chain the author "fixed"
//        the error by chaining; however the chain ignores its rejection,
//        and the caller can't `await` syncReader either.
function syncReader() {
  return getConfig().then((cfg) => cfg);   // returns a Promise, not a value
}

// BUG 3: caller treats syncReader as if it returned a value.
const cfg = syncReader();                  // cfg is a Promise
document.getElementById('config').textContent = String(cfg.theme);  // undefined

// BUG 4: inner Promise not returned from the .then, so report becomes
//        undefined by the time we await its `length`.
function report() {
  return getConfig().then((cfg) => {
    fetchPayload().then((p) => p + '/' + cfg.theme);    // result dropped
  });
}

report().then((line) => {
  document.getElementById('report').textContent = String(line && line.length);
});
