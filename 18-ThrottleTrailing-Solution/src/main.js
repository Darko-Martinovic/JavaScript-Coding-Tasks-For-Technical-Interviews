// =============================================================================
// SOLUTION 18 — Throttle That Drops the Last Call
// =============================================================================
//
// A correct leading+trailing throttle has TWO clocks: a "next allowed time"
// for the next leading edge, and a "pending args" slot for whatever came
// in during the cooldown. When the cooldown expires, the pending args are
// flushed. We also cancel the pending flush if a new leading edge happens.
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
  // FIX #1: closure-scoped slot for "args waiting to be flushed" and a
  //         timer id, so calls during the cooldown can land at the
  //         trailing edge (with the LATEST args, not the first dropped).
  let pendingArgs = null;
  let timerId = null;
  return function (...args) {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      // Leading edge: fire now, clear any pending trailing timer.
      if (timerId) { clearTimeout(timerId); timerId = null; }
      last = now;
      pendingArgs = null;
      fn(...args);
    } else {
      // Cooldown: stash the LATEST args; schedule one trailing flush.
      pendingArgs = args;
      if (!timerId) {
        timerId = setTimeout(() => {
          last = Date.now();
          timerId = null;
          // FIX #2: flush the LATEST captured args, not the earliest.
          const a = pendingArgs;
          pendingArgs = null;
          if (a) fn(...a);
        }, remaining);
      }
    }
  };
}

const throttled = throttle(paint, 200);
document.getElementById('box').addEventListener('mousemove', (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  throttled(Math.round(e.clientX - r.left), Math.round(e.clientY - r.top));
});
