// =============================================================================
// TASK 18 — Throttle That Drops the Last Call
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (the LAST call in a burst is lost)
//
// `throttle(fn, ms)` should ensure that `fn` runs at most once every `ms`,
// but the FINAL call in a burst MUST eventually run — otherwise the UI
// state lags behind the real input forever. The author wrote a strict
// leading-edge throttle that silently drops late calls.
//
// Use case: a position display that updates as you move the mouse over
// the box. The final position is the one that matters.
//
// THINGS TO SCRUTINISE:
//   1. After the cooldown is up, what schedules the TRAILING call with
//      the latest args? If nothing does, the last position is lost.
//   2. `last + ms <= now` compares against what `last` value when the
//      first call fires? Is `last` initialised to 0 or `now`?
//   3. The latest args are stored in `pendingArgs` but only on the
//      "skipped" branch — is the leading-edge call also overwritten?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Moving the mouse smoothly across the box: the displayed
//     coordinates update at most ~once per 200ms, and the FINAL
//     position matches where the mouse stopped.
//
// ACTUAL (buggy) BEHAVIOR: the displayed coordinates can stop short of
//   the final position by hundreds of pixels — the trailing call
//   never fires.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Throttle (move the mouse)</h1>
    <div id="box" style="width: 400px; height: 200px; background: #eef; border: 1px solid #99c;"></div>
    <p>Last: <strong id="pos">—</strong></p>
  </main>
`;

function paint(x, y) {
  document.getElementById('pos').textContent = `${x}, ${y}`;
}

function throttle(fn, ms) {
  let last = 0;
  // BUG: no trailing-edge scheduling. After the cooldown ends, if no new
  //      event arrives, the final args are simply lost.
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
    // BUG: skipped calls aren't recorded anywhere; nothing remembers them.
  };
}

const throttled = throttle(paint, 200);
document.getElementById('box').addEventListener('mousemove', (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  throttled(Math.round(e.clientX - r.left), Math.round(e.clientY - r.top));
});
