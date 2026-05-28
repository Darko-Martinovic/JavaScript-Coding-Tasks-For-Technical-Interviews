// =============================================================================
// TASK 26 — parseInt Without a Radix
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (some inputs parse to surprising values)
//
// A small "color picker" UI parses hex codes typed by the user, and a
// numeric form parses whatever's pasted in (e.g. zero-padded ids
// "07", "08", "09"). All three users get a different number than the
// one they typed.
//
// THINGS TO SCRUTINISE:
//   1. `parseInt("0x10")` with NO radix — what does it return? What
//      about `parseInt("08")` in old engines?
//   2. `parseInt(" 42  ")` — does it tolerate whitespace? Trailing
//      junk?
//   3. Missing NaN guard — is the value usable downstream?
//
// EXPECTED CORRECT BEHAVIOR:
//   - "0x10" parsed as a hex color stays `16`.
//   - "08" parsed as a decimal id is `8` (not `0` or `8` depending on
//     the engine).
//   - "42abc" rejected (not a clean number).
//
// ACTUAL (buggy) BEHAVIOR: "0x10" is read as 16 even in the decimal
//   field, "08" can be parsed as `0` on engines that respect octal
//   (and as `8` on modern ones — silent inconsistency), and "42abc"
//   is accepted as 42.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Parsing</h1>
    <pre id="out"></pre>
  </main>
`;

// BUG 1: missing radix — parseInt's auto-detect treats "0x…" as hex.
function parseDecimalId(raw) {
  return parseInt(raw);
}

// BUG 2: missing radix on hex parse — relies on the "0x" prefix being
//        present in input. If the prefix is missing, "10" is read as 10,
//        not 16.
function parseHexColor(raw) {
  return parseInt(raw);
}

// BUG 3: no isNaN / NaN guard — "abc" returns NaN and silently flows on.
function parseAge(raw) {
  return parseInt(raw);
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
