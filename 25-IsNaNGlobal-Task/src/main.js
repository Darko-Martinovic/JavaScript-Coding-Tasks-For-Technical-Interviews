// =============================================================================
// TASK 25 — isNaN vs Number.isNaN
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (a form input that should be rejected is accepted)
//
// A "make a deposit" form parses an amount and validates it. The
// validation uses the GLOBAL `isNaN(...)` which is famously broken for
// type checks: it COERCES its argument to a number first, so
// `isNaN('abc')` is `true` (good), but `isNaN('')` is `false` (bad —
// because `Number('')` is `0`).
//
// THINGS TO SCRUTINISE:
//   1. What does the global `isNaN` do to its argument before testing?
//   2. `Number.isNaN(...)` — does it coerce, or strictly check?
//   3. `parseFloat('1.2.3')` and `parseFloat(' 5 oranges')` — what do
//      they return? Do they "look valid" by isNaN?
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - `""` → rejected ("must be a number").
//   - `"abc"` → rejected.
//   - `"1.2.3"` → rejected (not a clean parse).
//   - `"5 oranges"` → rejected.
//   - `"42"` → accepted with `amount = 42`.
//   - `"Infinity"` → rejected (not a finite amount).
//
// ACTUAL (buggy) BEHAVIOR: `""` is accepted as 0; `"5 oranges"` is
//   accepted as 5; `"Infinity"` is accepted as Infinity.
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
  // BUG 1: parseFloat is lax — "5 oranges" → 5, "1.2.3" → 1.2.
  // BUG 2: global isNaN coerces — `isNaN('')` is false (Number('') === 0),
  //         and `isNaN(true)` is also false.
  const n = parseFloat(raw);
  if (isNaN(n)) return { ok: false, reason: 'must be a number' };
  // BUG 3: no finiteness check — accepts Infinity / -Infinity.
  return { ok: true, amount: n };
}

document.getElementById('go').onclick = () => {
  const raw = document.getElementById('amt').value;
  const v = validate(raw);
  document.getElementById('out').textContent = JSON.stringify(v);
};

// Self-test on load — open the console (or read the page):
const samples = ['', 'abc', '1.2.3', '5 oranges', '42', 'Infinity'];
const out = document.getElementById('out');
out.textContent = samples.map((s) => `${JSON.stringify(s)} → ${JSON.stringify(validate(s))}`).join('\n');
