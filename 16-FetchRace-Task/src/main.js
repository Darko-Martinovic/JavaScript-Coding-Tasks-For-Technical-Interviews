// =============================================================================
// TASK 16 — Race Condition: Latest-Typed-Wins
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (out-of-order async responses — DETERMINISTIC here)
//
// A "live search": each keystroke fires a fake fetch and paints its
// result. To make this lab deterministic, SHORTER queries take LONGER
// to resolve — so the response to "a" arrives AFTER the response to "ab".
// In the real world the slow one is usually the OLD one; here we make
// the OLD one always slow on purpose.
//
// Type "ab" quickly. Expected: the page settles on the "ab" result. Bug:
// the page settles on the "a" result because it arrives last.
//
// THINGS TO SCRUTINISE:
//   1. Two in-flight fetches: how does the handler know which one is
//      still relevant? Compare the query string against the LATEST one.
//   2. AbortController — what does it do, and can you wire one per
//      keystroke so the previous request is cancelled before the new
//      one fires?
//   3. The loading spinner: which response is allowed to CLEAR it?
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - Typing "ab" and waiting briefly shows "Results for: ab".
//   - The spinner is only hidden by the response for the latest query.
//
// ACTUAL (buggy) BEHAVIOR: results display "Results for: a" (the older
//   query's response arrived last, after "ab"'s response, and clobbered).
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

// Slower for shorter queries → forces "stale wins" deterministically.
function fakeSearch(q) {
  const delay = 500 - q.length * 200;
  return new Promise((resolve) => setTimeout(() => resolve(`Results for: ${q}`), delay));
}

const q = document.getElementById('q');
const result = document.getElementById('result');
const spinner = document.getElementById('spinner');

// BUG 1: no per-keystroke cancellation. The previous in-flight request
//        is still racing to paint when the new one starts.
// BUG 2: no "is this the latest?" check. Whatever resolves LAST wins.
// BUG 3: spinner cleared by whichever response arrives last (also the
//        wrong one — see BUG 2).
q.addEventListener('input', async () => {
  spinner.style.display = '';
  const text = await fakeSearch(q.value);
  result.textContent = text;
  spinner.style.display = 'none';
});
