// =============================================================================
// SOLUTION 15 — Fire-and-Forget .then() Chain
// =============================================================================
//
// Every Promise chain needs a terminal `.catch`, every async function that
// the caller depends on must be awaited, and every inner Promise in a
// `.then` callback must be RETURNED so the outer chain waits for it.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Boot</h1>
    <p>Config: <span id="config"></span></p>
    <p>Report: <span id="report"></span></p>
  </main>
`;

function prewarmCache() {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('warm fail')), 50));
}

function getConfig() {
  return new Promise((resolve) => setTimeout(() => resolve({ theme: 'dark' }), 60));
}

function fetchPayload() {
  return new Promise((resolve) => setTimeout(() => resolve('hello'), 30));
}

// FIX #1: terminal `.catch` so a rejected prewarm doesn't become an
//         "unhandledrejection". Logging-only is a deliberate choice for
//         best-effort warm-ups; if you'd rather propagate, return the
//         Promise and await it at the boot site.
prewarmCache().catch((err) => console.warn('prewarm failed:', err.message));

// FIX #2: make the boot routine async so we can `await`. No more
//         "syncReader returns a Promise that callers mis-use".
async function boot() {
  const cfg = await getConfig();
  document.getElementById('config').textContent = JSON.stringify(cfg);

  // FIX #3: return the inner Promise from the helper, so its resolved
  //         value flows out and `await` reads the actual line.
  const line = await report(cfg);
  document.getElementById('report').textContent = String(line.length);
}

async function report(cfg) {
  const p = await fetchPayload();
  return p + '/' + cfg.theme;
}

boot().catch((err) => {
  // FIX #4: terminal catch on the top-level boot promise.
  console.error('boot failed:', err);
});
