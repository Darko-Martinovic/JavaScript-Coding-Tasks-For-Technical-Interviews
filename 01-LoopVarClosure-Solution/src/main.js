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
    <button id="restart">Restart</button>
    <button id="reset">Reset</button>
  </main>
`;

const list = document.getElementById('list');
const secs = document.getElementById('secs');
let intervalId;
let elapsed = 0;

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
document.getElementById('reset').addEventListener('click', () => {
  console.log('[reset] clicked');
  elapsed = 0;
  secs.textContent = '0';
  list.innerHTML = '';
});

document.getElementById('restart').addEventListener('click', start);
start();
