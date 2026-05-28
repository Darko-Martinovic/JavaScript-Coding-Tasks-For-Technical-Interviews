// =============================================================================
// TASK 10 — Accidental Global from a Missing const  (STATIC / code-review)
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: static — this file is loaded as `<script type="module">`, which is
//   in strict mode. Some of the "accidental globals" below WOULD throw
//   under strict — but the author worked around the symptom by attaching
//   to `window` directly and using `var` patterns. The code now "works"
//   and would only be caught at code review.
//
// A counter factory should return a function that increments its OWN
// count and returns it. Two counters should be independent. Plus a small
// loop renders progress bars — its index has the same problem.
//
// CHECKLIST (FOUR distinct issues to flag):
//   1. `window.count = ...` instead of declaring with `let` — every
//      `makeCounter()` shares the same global slot. Look for that and
//      every other binding that goes through `window.` or has no keyword.
//   2. The for-loop `for (i = 0; …)` — what scope is `i` in? Try calling
//      `makeCounter` AFTER the loop runs and look at `count`.
//   3. `delete` of a property — does this scrub the leak, or just the
//      symptom? After clicking Reset, click "Show globals" and read.
//   4. Top of file: there's a stray identifier on a line by itself. Spot it.
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - `a = makeCounter(); b = makeCounter(); a(); a(); b();` → a=2, b=1
//   - Progress loop renders 3 bars at 10%, 50%, 100% — no `window.i`.
//   - "Show globals" prints an empty array (no leaked names).
//
// ACTUAL (buggy) BEHAVIOR: both counters share one global so a() and b()
// both bump the same `window.count`; `window.i` lingers after the loop;
// and Reset only resets the value, not the leak.
// =============================================================================

// BUG #1: a stray identifier evaluated at module top with no side effect —
//          easy to miss in review. (It's also a misspelled `strict`.)
'strikt mode';

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
  // BUG #2: assigning to `window.count` ensures both counters share state.
  //          With strict mode this is the only way the author got it
  //          "working" — but it's a leak by construction.
  window.count = 0;
  return function () {
    window.count += 1;
    return window.count;
  };
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
// BUG #3: `for (window.i = 0; …)` — same trick as above. `i` was made
//          global on purpose to silence a strict-mode error. After the
//          loop, `window.i === 3` and stays there forever.
for (window.i = 0; window.i < 3; window.i++) {
  const div = document.createElement('div');
  div.style.cssText = 'background:#ffd54f;margin:4px 0;height:12px;';
  div.style.width = ([10, 50, 100][window.i] || 0) + '%';
  bars.appendChild(div);
}

document.getElementById('reset').onclick = () => {
  // BUG #4: zeroes the value but leaves the global slot in place.
  window.count = 0;
  document.getElementById('a').textContent = '0';
  document.getElementById('b').textContent = '0';
};

document.getElementById('show').onclick = () => {
  const leaks = ['count', 'i'].filter((k) => k in window);
  document.getElementById('globals').textContent = JSON.stringify(leaks);
};
