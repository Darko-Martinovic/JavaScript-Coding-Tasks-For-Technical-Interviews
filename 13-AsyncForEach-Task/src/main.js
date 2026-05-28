// =============================================================================
// TASK 13 — await Inside forEach
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (visibly wrong ordering + a premature "done" toast)
//
// Three "URLs" are processed by a fake async fetch. They each take a
// different amount of time (longer first). The UI should:
//   - render each result IN INPUT ORDER as it becomes available,
//   - show "All done" only AFTER every URL completes.
//
// THINGS TO SCRUTINISE:
//   1. `forEach((u) => { ... await ... })` — what does `forEach` do with
//      the Promise the callback returns? Does it wait?
//   2. Even with the right loop, are results pushed in INPUT order or
//      ARRIVAL order?
//   3. The "All done" toast — what does `await Promise.all(...)` look
//      like when wired up to side-effects-only callbacks?
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - The list paints in input order: "A (300ms) → ok", "B (200ms) → ok",
//     "C (100ms) → ok".
//   - "All done" appears AFTER the C line is in the DOM.
//
// ACTUAL (buggy) BEHAVIOR: "All done" appears IMMEDIATELY (before any
//   line); the entries arrive in C → B → A order; and the loading
//   spinner never clears.
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
  // BUG 1: forEach ignores the Promise returned by the async callback,
  //        so `await loadAll()` resolves IMMEDIATELY — before anything
  //        has been pushed to the DOM.
  URLS.forEach(async (u) => {
    const text = await fakeFetch(u);
    // BUG 2: each entry is appended in ARRIVAL order — shortest delay
    //        wins. The input order is lost.
    const li = document.createElement('li');
    li.textContent = text;
    results.appendChild(li);
  });
}

(async () => {
  await loadAll();
  // BUG 3: this runs synchronously right after the forEach returns —
  //        not after the work finishes.
  document.getElementById('status').textContent = '';
  document.getElementById('toast').textContent = 'All done';
})();
