// =============================================================================
// TASK 01 — Stale Closure in setTimeout Loop
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — open the console)
//
// A small "countdown" UI is supposed to print 1, 2, 3, 4, 5 (one per 100ms)
// into a list, and an interval below it should tick once per second updating
// the "Seconds elapsed:" label. There is also a Reset button that is supposed
// to register exactly ONE click listener.
//
// GOAL: Fix ALL the bugs so the page behaves as described below. There are
//       THREE separate problems.
//
// THINGS TO SCRUTINISE:
//   1. What value of `i` does each scheduled callback see? It was scheduled
//      inside a `for (var ...)` — what did it close over?
//   2. The interval id is captured — but is it ever passed to clearInterval?
//      What happens if you click "Restart" twice? Watch the console.
//   3. `attachReset()` is called from `start()`. How many times does it run
//      across all clicks? Watch the listener count.
//
// EXPECTED CORRECT BEHAVIOR:
//   - The list prints exactly: 1, 2, 3, 4, 5  (one per 100ms).
//   - The seconds counter ticks once a second, even after Restart, and
//     there is only ever ONE interval running.
//   - Reset has exactly ONE click handler regardless of how many Restarts.
//
// ACTUAL (buggy) BEHAVIOR: the list prints `tick 6` five times; every Restart
//   leaves the previous interval running so the counter accelerates; and
//   Reset's handler stacks up so the third click logs three resets.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Countdown</h1>
    <ol id="list"></ol>
    <p>Seconds elapsed: <strong id="secs">0</strong></p>
    <p>Reset handlers that ran on the last <em>Reset</em> click: <strong id="resetCount">0</strong> <em>(expected: 1)</em></p>
    <button id="restart">Restart countdown (re-run 1→5 + restart timer)</button>
    <button id="reset">Reset (clear list + zero seconds)</button>

    <section style="margin-top:20px; padding-top:12px; border-top:1px solid #ddd; font-size:13px; color:#555; max-width:560px;">
      <p style="margin:0 0 6px;"><strong>Expected behavior:</strong></p>
      <ul style="margin:0; padding-left:20px;">
        <li>The list prints exactly <code>1, 2, 3, 4, 5</code> — one item per 100ms.</li>
        <li><strong>Restart countdown</strong>: re-runs the 1→5 ticks and restarts the
            seconds timer. There must only ever be <em>one</em> timer running, so the
            counter ticks once per second — it must NOT accelerate after repeated clicks.</li>
        <li><strong>Reset</strong>: clears the list and sets seconds back to 0 (the timer
            keeps running). It must have exactly <em>one</em> click handler no matter how
            many times you Restart — so the "Reset handlers that ran on the last Reset click"
            value above must always read <strong>1</strong> (and the console must log
            "[reset] clicked" once per click, not N times).</li>
      </ul>
    </section>
  </main>
`;

const list = document.getElementById('list');
const secs = document.getElementById('secs');
const resetCountEl = document.getElementById('resetCount');
let intervalId;
let elapsed = 0;

// Instrumentation (NOT part of any bug): counts how many times the Reset
// handler runs for a SINGLE click. Stacked listeners all receive the same
// click event, so we dedupe on event.timeStamp to count per-click.
let resetFires = 0;
let lastResetStamp = -1;

function start() {
  list.innerHTML = '';
  // BUG: `var i` is function-scoped, so all five timeouts close over the
  //      SAME `i` — which is 6 by the time any of them fires.
  for (var i = 1; i <= 5; i++) {
    setTimeout(() => {
      const li = document.createElement('li');
      li.textContent = `tick ${i}`;
      list.appendChild(li);
    }, i * 100);
  }

  // BUG: starting a new interval without clearing the previous one — every
  //      Restart leaves the prior timer running, so seconds accelerate.
  setInterval(() => {
    elapsed += 1;
    secs.textContent = String(elapsed);
  }, 1000);

  attachReset();
}

function attachReset() {
  // BUG: a fresh listener is added every Restart. The handler stacks.
  document.getElementById('reset').addEventListener('click', (e) => {
    console.log('[reset] clicked');
    // Instrumentation: same click event hits every stacked listener, so reset
    // the per-click tally when the timeStamp changes, then count this firing.
    if (e.timeStamp !== lastResetStamp) {
      lastResetStamp = e.timeStamp;
      resetFires = 0;
    }
    resetFires += 1;
    resetCountEl.textContent = String(resetFires);
    elapsed = 0;
    secs.textContent = '0';
    list.innerHTML = '';
  });
}

document.getElementById('restart').addEventListener('click', start);
start();
