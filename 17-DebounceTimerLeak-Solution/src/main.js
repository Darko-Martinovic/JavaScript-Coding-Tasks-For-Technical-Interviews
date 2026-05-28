// =============================================================================
// SOLUTION 17 — Debounce Whose Timer Never Clears
// =============================================================================
//
// The timer id must live in the CLOSURE (one slot shared across all calls)
// so the wrapper can cancel any pending timer when a new call comes in.
// The latest `args` must be forwarded into the eventual call, not re-read.
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

function debounce(fn, ms) {
  // FIX #1: `timerId` lives in the closure, ONE slot shared across every
  //         call to the wrapper. clearTimeout(timerId) now actually cancels
  //         the previous pending fire before scheduling the next.
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    // FIX #2: forward the LATEST args (and `this`) into the eventual call,
    //         so the call uses what the caller actually asked for instead
    //         of re-reading a different source.
    timerId = setTimeout(() => fn.apply(this, args), ms);
  };
}

const debounced = debounce(search, 250);
document.getElementById('q').addEventListener('input', (e) => debounced(e.target.value));
