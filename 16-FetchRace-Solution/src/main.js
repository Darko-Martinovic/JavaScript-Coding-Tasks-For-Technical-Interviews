// =============================================================================
// SOLUTION 16 — Race Condition: Latest-Typed-Wins
// =============================================================================
//
// Two complementary fixes: a generation counter (or "latest query string"
// snapshot) so stale responses are ignored, and an AbortController so the
// previous request can be cancelled instead of merely ignored. Either alone
// is enough; together is best practice.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Live search</h1>
    <input id="q" placeholder="type a word…" />
    <p id="spinner" style="color: #888">loading…</p>
    <pre id="result"></pre>
  </main>
`;

// Same fake: shorter queries take LONGER, so the stale response would
// normally clobber the fresh one — these fixes prevent that.
function fakeSearch(q, signal) {
  const delay = 500 - q.length * 200;
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => resolve(`Results for: ${q}`), delay);
    signal?.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('aborted', 'AbortError')); });
  });
}

const q = document.getElementById('q');
const result = document.getElementById('result');
const spinner = document.getElementById('spinner');

// FIX #1: track the most recent request and ignore any older response.
//         A simple monotonically-increasing counter ("generation") works.
let gen = 0;
// FIX #2: also cancel the older request so it doesn't run to completion
//         and waste resources. The handler shares an AbortController
//         across the in-flight request and rotates it per keystroke.
let controller;

q.addEventListener('input', async () => {
  const myGen = ++gen;
  controller?.abort();
  controller = new AbortController();
  spinner.style.display = '';
  try {
    const text = await fakeSearch(q.value, controller.signal);
    // FIX #3: stale response — drop it. Only the LATEST keystroke is
    //         allowed to paint and hide the spinner.
    if (myGen !== gen) return;
    result.textContent = text;
    spinner.style.display = 'none';
  } catch (err) {
    if (err.name !== 'AbortError') throw err;
  }
});
