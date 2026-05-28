// =============================================================================
// TASK 17 — Debounce Whose Timer Never Clears
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (debounce visibly does not debounce)
//
// A `debounce(fn, ms)` should: collapse a burst of calls into ONE call
// that happens `ms` after the LAST call, and pass the most recent
// arguments. The version here fails on all three counts.
//
// THINGS TO SCRUTINISE:
//   1. Where is the timer id stored? Is `clearTimeout(timerId)` ever
//      reached on the SECOND call before the new setTimeout?
//   2. Inside the timer callback, `fn.apply(this, args)` — what is
//      `this`? What WERE the args when the timer was scheduled?
//   3. The wrapper returns a new function — is the closure shared
//      across calls, or fresh per call?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Typing "hello" fast: the search runs ONCE, 250ms after "o",
//     with q="hello".
//   - The call count below the input increases by exactly 1 per burst.
//
// ACTUAL (buggy) BEHAVIOR: every keystroke triggers a separate timer
//   that fires later — the "Calls" count climbs once per keystroke,
//   and you see "search('h')", "search('he')", etc., instead of just
//   "search('hello')".
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Debounce</h1>
    <input id="q" placeholder="type fast…" />
    <p>Calls: <strong id="calls">0</strong></p>
    <pre id="log"></pre>
  </main>
`;

let calls = 0;
const log = document.getElementById('log');
function search(q) {
  calls += 1;
  document.getElementById('calls').textContent = String(calls);
  log.textContent += `search(${JSON.stringify(q)})\n`;
}

// BUG 1: `timerId` is declared INSIDE the returned function, so each call
//        gets its own — and clearTimeout never has the previous id.
// BUG 2: the wrapped call passes nothing (or the wrong args) — see below.
function debounce(fn, ms) {
  return function (...args) {
    let timerId;                       // fresh per call → no cancellation
    timerId = setTimeout(() => {
      // BUG 3: ignores the new args and re-reads from the DOM, which is
      //        also out-of-date by the time the timer fires.
      fn(document.getElementById('q').value);
    }, ms);
  };
}

const debounced = debounce(search, 250);
document.getElementById('q').addEventListener('input', (e) => debounced(e.target.value));
