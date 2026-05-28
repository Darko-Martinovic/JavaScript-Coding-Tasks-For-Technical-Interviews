// =============================================================================
// SOLUTION 25 — isNaN vs Number.isNaN
// =============================================================================
//
// `Number.isNaN` doesn't coerce — it's true only when the argument is
// literally the value NaN. Pair it with `Number()` (strict — empty string
// becomes 0 BUT that's fine because we explicitly reject the empty input
// first) or with a regex that rejects garbage suffixes. And reject
// non-finite values with `Number.isFinite`.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Deposit</h1>
    <input id="amt" placeholder="amount" />
    <button id="go">Deposit</button>
    <pre id="out"></pre>
  </main>
`;

function validate(raw) {
  const trimmed = String(raw).trim();
  // FIX #1: reject empty string explicitly. (Number('') is 0, which would
  //         otherwise sneak through.)
  if (trimmed === '') return { ok: false, reason: 'must be a number' };
  // FIX #2: use Number(...) which is STRICT — "5 oranges" → NaN. parseFloat
  //         would silently accept "5 oranges" as 5.
  const n = Number(trimmed);
  // FIX #3: Number.isFinite rejects NaN AND ±Infinity in one check, and
  //         it does NOT coerce — so `Number.isFinite('5')` is false (good).
  if (!Number.isFinite(n)) return { ok: false, reason: 'must be a finite number' };
  return { ok: true, amount: n };
}

document.getElementById('go').onclick = () => {
  const raw = document.getElementById('amt').value;
  const v = validate(raw);
  document.getElementById('out').textContent = JSON.stringify(v);
};

const samples = ['', 'abc', '1.2.3', '5 oranges', '42', 'Infinity'];
const out = document.getElementById('out');
out.textContent = samples.map((s) => `${JSON.stringify(s)} → ${JSON.stringify(validate(s))}`).join('\n');
