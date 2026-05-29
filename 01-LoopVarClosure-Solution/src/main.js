// =============================================================================
// SOLUTION 01 — Stale Closure in setTimeout Loop
// =============================================================================
//
// Every change is annotated `// FIX #n`. The countdown must (a) print each
// distinct value of i, (b) leave only one interval alive across Restarts, and
// (c) attach the Reset listener exactly once.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Countdown</h1>
    <ol id="list"></ol>
    <p>Seconds elapsed: <strong id="secs">0</strong></p>
    <p>Reset handler fired: <strong id="resetCount">0</strong> time(s) on the last click</p>
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
            many times you Restart — the Nth click must log "[reset] clicked" once, not N times.</li>
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
// handler runs for a SINGLE click. With the listener attached exactly once
// (FIX #3) this always reads 1 — the per-click dedupe on event.timeStamp
// mirrors the Task so the two screens look identical.
let resetFires = 0;
let lastResetStamp = -1;

function start() {
  list.innerHTML = '';
  // FIX #1: `let` makes a fresh binding per iteration, so each scheduled
  //         callback closes over its own `i`. (`var` is function-scoped, so
  //         all five callbacks shared one variable which was 6 by the time
  //         any timer fired.)
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
      const li = document.createElement('li');
      li.textContent = `tick ${i}`;
      list.appendChild(li);
    }, i * 100);
  }

  // FIX #2: Clear any previous interval before starting a new one. Without
  //         this, every Restart left an additional timer running and the
  //         seconds counter accelerated geometrically.
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    elapsed += 1;
    secs.textContent = String(elapsed);
  }, 1000);
  // FIX #3 (related): no longer call attachReset() here. Moved to module load.
}

// FIX #3: Attach the Reset listener exactly once, at module load. Calling it
//         from inside start() (which runs on every Restart) was stacking a
//         fresh handler each time so the Nth click logged N times.
document.getElementById('reset').addEventListener('click', (e) => {
  console.log('[reset] clicked');
  // Instrumentation: per-click tally (resets on a new timeStamp). Only one
  // listener exists, so this always shows 1 — contrast with the buggy Task.
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

document.getElementById('restart').addEventListener('click', start);
start();
