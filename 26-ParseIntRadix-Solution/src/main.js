// =============================================================================
// SOLUTION 26 — parseInt Without a Radix
// =============================================================================
//
// Always pass the radix. For "clean number" validation, prefer
// `Number(trimmed)` plus `Number.isFinite` over `parseInt` — `parseInt`
// is happy to accept "42abc" as 42 by design.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Parsing</h1>
    <pre id="out"></pre>
  </main>
`;

// FIX #1: explicit base-10 radix. Now "0x10" is `0` (parses as far as it
//         can, stops at 'x'), and "08" is reliably `8`.
function parseDecimalId(raw) {
  const n = parseInt(raw, 10);
  // FIX #2: defensive NaN check, in case `raw` was non-numeric entirely.
  return Number.isNaN(n) ? null : n;
}

// FIX #3: explicit base-16 radix. Now "10" → 16, "ff" → 255 — no
//         dependence on a "0x" prefix to flip the parser into hex mode.
function parseHexColor(raw) {
  const n = parseInt(raw, 16);
  return Number.isNaN(n) ? null : n;
}

// FIX #4: for "real number?" validation, `Number(...)` is stricter than
//         `parseInt(...)` — "42abc" becomes NaN instead of 42. Pair with
//         `Number.isFinite` to also reject ±Infinity.
function parseAge(raw) {
  const n = Number(String(raw).trim());
  return Number.isFinite(n) ? n : null;
}

const samples = [
  ['parseDecimalId("0x10")', parseDecimalId('0x10')],
  ['parseDecimalId("08")  ', parseDecimalId('08')],
  ['parseHexColor("10")   ', parseHexColor('10')],
  ['parseHexColor("0xff") ', parseHexColor('0xff')],
  ['parseAge("42abc")     ', parseAge('42abc')],
  ['parseAge("abc")       ', parseAge('abc')],
];
document.getElementById('out').textContent = samples.map(([n, v]) => `${n}  =>  ${v}`).join('\n');
