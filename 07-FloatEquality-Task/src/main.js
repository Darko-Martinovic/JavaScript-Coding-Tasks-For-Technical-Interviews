// =============================================================================
// TASK 07 — Floating-Point Equality
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and produces visibly wrong output)
//
// A toy "cart" totals 7 items at $0.10 each and tries to apply a 30¢ off
// coupon if the total reaches $0.70. It also runs three "self-check" tests
// at the bottom which should all print PASS — they don't.
//
// THINGS TO SCRUTINISE:
//   1. What does `0.1 + 0.2` actually equal? Type it in the console.
//   2. The test uses `===` against a floating literal — is that ever safe
//      for non-trivial decimal arithmetic?
//   3. `.toFixed(2)` returns a STRING. What happens when you `===` a string
//      and a number? And does `.toFixed` round the way the bank rounds?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Total of 7 × $0.10 displays as $0.70.
//   - The coupon ("≥ $0.70") IS applied — final price is $0.40.
//   - All three self-check tests print "PASS".
//
// ACTUAL (buggy) BEHAVIOR: total displays as $0.7000000000000001; the
//   coupon is NOT applied because `>=` is checked against a different
//   floating literal whose representation is also off; and the three
//   self-checks all FAIL.
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

let subtotal = 0;
for (const p of prices) subtotal += p;          // 0.7000000000000001

document.getElementById('subtotal').textContent = subtotal;  // BUG: prints garbage trailing digits

// BUG: comparing a sum of floats with `===` against a decimal literal.
//      0.1+0.1+…+0.1 (×7) is not exactly 0.7.
const coupon = subtotal === 0.7 ? 0.3 : 0;
document.getElementById('final').textContent = (subtotal - coupon).toFixed(2);

const tests = document.getElementById('tests');
function check(name, ok) {
  const li = document.createElement('li');
  li.textContent = `${name}: ${ok ? 'PASS' : 'FAIL'}`;
  li.style.color = ok ? 'green' : 'crimson';
  tests.appendChild(li);
}

check('0.1 + 0.2 === 0.3',           0.1 + 0.2 === 0.3);
// BUG: comparing a number to a string. toFixed returns "0.30", not 0.30.
check('(0.1 + 0.2).toFixed(2) is 0.3', (0.1 + 0.2).toFixed(2) === 0.3);
// BUG: cumulative error sneaks into the comparison.
let cents = 0;
for (let i = 0; i < 10; i++) cents += 0.1;
check('ten dimes equal one dollar',  cents === 1);
