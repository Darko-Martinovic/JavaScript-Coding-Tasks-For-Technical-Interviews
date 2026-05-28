// =============================================================================
// SOLUTION 07 — Floating-Point Equality
// =============================================================================
//
// IEEE-754 doubles can't represent 0.1 exactly, so summing them gives values
// like 0.7000000000000001. The fix: never compare floats with === for
// equality. Use an epsilon tolerance for display arithmetic, or — better
// — keep money in integer cents and convert only at the I/O boundary.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Cart</h1>
    <p>Subtotal: $<span id="subtotal"></span></p>
    <p>After coupon: $<span id="final"></span></p>
    <h3>Self-checks</h3>
    <ul id="tests"></ul>
  </main>
`;

const prices = [0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10];

// FIX #1: Work in integer cents to avoid binary-fraction round-off entirely.
//         Sum and compare on integers, format only for display.
const subtotalCents = prices.reduce((sum, p) => sum + Math.round(p * 100), 0);
document.getElementById('subtotal').textContent = (subtotalCents / 100).toFixed(2);

// FIX #2: Compare integer cents. No epsilon needed because 70 is exact.
const couponCents = subtotalCents >= 70 ? 30 : 0;
document.getElementById('final').textContent = ((subtotalCents - couponCents) / 100).toFixed(2);

const tests = document.getElementById('tests');
function check(name, ok) {
  const li = document.createElement('li');
  li.textContent = `${name}: ${ok ? 'PASS' : 'FAIL'}`;
  li.style.color = ok ? 'green' : 'crimson';
  tests.appendChild(li);
}

// FIX #3: Use an epsilon (Number.EPSILON, or a domain-tolerance like 1e-9).
//         For currency, integer cents are preferable, but for unit
//         conversions / physics you typically use a relative tolerance.
const EPS = 1e-9;
check('0.1 + 0.2 ≈ 0.3',            Math.abs(0.1 + 0.2 - 0.3) < EPS);
// FIX #4: parseFloat the toFixed string back (or just compare numerics):
//         toFixed returns a STRING and `=== 0.3` is comparing across types.
check('(0.1 + 0.2).toFixed(2) is "0.30"', (0.1 + 0.2).toFixed(2) === '0.30');
let cents = 0;
for (let i = 0; i < 10; i++) cents += 0.1;
check('ten dimes ≈ one dollar',     Math.abs(cents - 1) < EPS);
