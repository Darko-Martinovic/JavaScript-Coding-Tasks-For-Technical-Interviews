// =============================================================================
// TASK 21 — Interval Closure Holds a Large Object
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (memory growth + stale-data ticks visible at runtime)
//
// On clicking "Start": a big 5MB payload is loaded, and a setInterval
// ticks once a second showing its first byte for visual diagnostics.
// On clicking "Stop": the interval should be cleared AND the payload
// should become garbage-collectable so the next "Start" can load a
// fresh one without retaining the old.
//
// THINGS TO SCRUTINISE:
//   1. The interval callback captures `payload`. Does setting
//      `payload = null` in Stop release the byte buffer if the
//      callback still references it?
//   2. After Stop, the interval id is set to `null` — was clearInterval
//      called WITH that id first?
//   3. The DOM display node "payloadOut" — does anything pin it after
//      Stop? Are there other references to the payload?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Start → "first byte" updates each second.
//   - Stop → updates stop AND the payload is dropped (the GC log shows
//     "payload released"; in the real world you'd see the heap go down).
//   - Multiple Start/Stop cycles do NOT accumulate timers OR retained
//     payloads.
//
// ACTUAL (buggy) BEHAVIOR: after Stop, the interval keeps firing for a
//   beat (clearInterval was passed null), the payload is retained by
//   the still-living timer's closure (or by `lastSeen` below), and
//   each Start/Stop cycle adds another retained 5MB buffer.
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

let payload = null;
let intervalId = null;
const lastSeen = [];     // for debugging — never cleared

function loadBigPayload() {
  // a 5MB buffer; in real apps this might be parsed JSON or pixel data.
  return new Uint8Array(5 * 1024 * 1024).map((_, i) => i & 0xff);
}

document.getElementById('start').onclick = () => {
  payload = loadBigPayload();
  // BUG 1: the interval's closure references `payload`. Even if we set
  //        `payload = null` later, the timer's closure still pins it.
  intervalId = setInterval(() => {
    document.getElementById('byte').textContent = String(payload[0]);
    lastSeen.push(payload);   // BUG 2: also pins via lastSeen
  }, 1000);
};

document.getElementById('stop').onclick = () => {
  // BUG 3: assigning intervalId = null BEFORE calling clearInterval(id).
  const id = intervalId;
  intervalId = null;
  clearInterval(intervalId);  // clearInterval(null) — no-op
  // BUG 4: zeroing the OUTER `payload` doesn't reach the timer's closure
  //        if the timer is still alive (and it is — see BUG 3).
  payload = null;
  document.getElementById('seen').textContent =
    `retained=${lastSeen.length}`;  // grows forever
};
