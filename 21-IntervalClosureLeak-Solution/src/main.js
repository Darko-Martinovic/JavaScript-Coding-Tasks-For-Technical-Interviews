// =============================================================================
// SOLUTION 21 — Interval Closure Holds a Large Object
// =============================================================================
//
// Three fixes: stop the timer with the right id BEFORE zeroing it; do not
// pin the payload anywhere unrelated (lastSeen pushed forever); and have
// the interval read from the live outer slot so clearing that slot also
// drops the payload from view. Even better: keep the interval's closure
// thin — refer to a holder object whose `.value` can be nulled.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Big payload monitor</h1>
    <button id="start">Start</button>
    <button id="stop">Stop</button>
    <p>First byte: <strong id="byte">—</strong></p>
    <p>Last seen: <strong id="seen">—</strong></p>
  </main>
`;

let intervalId = null;
// FIX #1: hold the payload in a small slot object the closure can read
//         through. Clearing `holder.value` releases the buffer even
//         while the closure is alive.
const holder = { value: null };

function loadBigPayload() {
  return new Uint8Array(5 * 1024 * 1024).map((_, i) => i & 0xff);
}

document.getElementById('start').onclick = () => {
  // FIX #2: tear down any previous timer first so Start/Stop/Start does
  //         not stack two intervals on the same holder.
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
  holder.value = loadBigPayload();
  intervalId = setInterval(() => {
    if (!holder.value) return;
    document.getElementById('byte').textContent = String(holder.value[0]);
  }, 1000);
};

document.getElementById('stop').onclick = () => {
  // FIX #3: clearInterval with the LIVE id, THEN zero the slot. The
  //         buggy version cleared null and missed the timer entirely.
  clearInterval(intervalId);
  intervalId = null;
  // FIX #4: nulling the payload through the holder releases the byte
  //         buffer — even if the closure outlived the call.
  holder.value = null;
  document.getElementById('seen').textContent = 'released';
};
