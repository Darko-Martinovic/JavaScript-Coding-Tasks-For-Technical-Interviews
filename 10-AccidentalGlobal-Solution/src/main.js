// =============================================================================
// SOLUTION 10 — Accidental Global from a Missing const
// =============================================================================
//
// Each counter must own its own state via a closure. The for-loop index
// belongs in block scope. And the stray identifier at top-of-file was a
// typo'd directive doing nothing. None of these are caught by the runtime
// in strict-by-default module mode — they only fail a review.
// =============================================================================

// FIX #1: removed the stray `'strikt mode'` line. It looked like a strict
//         directive but was misspelled, so it was just an unused string
//         expression — silent in modules.

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Counters & progress</h1>
    <p>Counter A: <strong id="a">0</strong></p>
    <p>Counter B: <strong id="b">0</strong></p>
    <button id="bumpA">Bump A</button>
    <button id="bumpB">Bump B</button>
    <button id="reset">Reset</button>
    <div id="bars"></div>
    <button id="show">Show globals</button>
    <pre id="globals"></pre>
  </main>
`;

function makeCounter() {
  // FIX #2: `let count` is now a closure-local. Each call to makeCounter
  //         creates a fresh binding, so two counters are independent. The
  //         old version stored on `window` so both shared the same slot.
  let count = 0;
  function tick() { count += 1; return count; }
  tick.reset = () => { count = 0; };
  return tick;
}

const a = makeCounter();
const b = makeCounter();

document.getElementById('bumpA').onclick = () => {
  document.getElementById('a').textContent = a();
};
document.getElementById('bumpB').onclick = () => {
  document.getElementById('b').textContent = b();
};

const bars = document.getElementById('bars');
// FIX #3: Loop index is `let`-scoped. The old code wrote it to `window.i`
//         so it survived past the loop and showed up under "Show globals".
for (let i = 0; i < 3; i++) {
  const div = document.createElement('div');
  div.style.cssText = 'background:#ffd54f;margin:4px 0;height:12px;';
  div.style.width = ([10, 50, 100][i] || 0) + '%';
  bars.appendChild(div);
}

document.getElementById('reset').onclick = () => {
  // FIX #4: Expose a `.reset()` on each counter so the closure can clear
  //         its own state. The buggy version "scrubbed" by writing
  //         `window.count = 0`, which only reset the leaked slot — and
  //         left the global slot itself in place.
  a.reset();
  b.reset();
  document.getElementById('a').textContent = '0';
  document.getElementById('b').textContent = '0';
};

document.getElementById('show').onclick = () => {
  const leaks = ['count', 'i'].filter((k) => k in window);
  document.getElementById('globals').textContent = JSON.stringify(leaks);
};
