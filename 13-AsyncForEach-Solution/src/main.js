// =============================================================================
// SOLUTION 13 — await Inside forEach
// =============================================================================
//
// `forEach` is built around a synchronous callback; it drops the Promise
// the async function returns, so there is no way to wait on it. Use
// `for…of` (sequential) or `Promise.all(map(...))` (parallel) and choose
// based on whether order or throughput matters.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Fetch demo</h1>
    <p id="status">loading…</p>
    <ol id="results"></ol>
    <p id="toast" style="color: green"></p>
  </main>
`;

const URLS = [
  { name: 'A', delay: 300 },
  { name: 'B', delay: 200 },
  { name: 'C', delay: 100 },
];

function fakeFetch(u) {
  return new Promise((resolve) => setTimeout(() => resolve(`${u.name} → ok`), u.delay));
}

async function loadAll() {
  const results = document.getElementById('results');
  // FIX #1: `Promise.all(map(...))` runs the fetches concurrently AND
  //         returns a single Promise that loadAll() can return — so
  //         `await loadAll()` actually waits.
  // FIX #2: Render from the results array AFTER they're all back, so
  //         the painted order matches the input order rather than the
  //         arrival order.
  const texts = await Promise.all(URLS.map(fakeFetch));
  for (const text of texts) {
    const li = document.createElement('li');
    li.textContent = text;
    results.appendChild(li);
  }
}

(async () => {
  // FIX #3: now that loadAll returns a real Promise, awaiting it sequences
  //         the "All done" toast AFTER every result is painted.
  await loadAll();
  document.getElementById('status').textContent = '';
  document.getElementById('toast').textContent = 'All done';
})();
