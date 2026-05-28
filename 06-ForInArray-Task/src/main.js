// =============================================================================
// TASK 06 — for…in Over an Array
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and produces visibly wrong output)
//
// Renders a list of prices and a running total. A "Bulk add tax" helper
// later writes an `addTax` method on Array.prototype (this is bad practice,
// but real codebases pull in libraries that do similar things). The bug
// becomes visible once that helper exists.
//
// THINGS TO SCRUTINISE:
//   1. `for (key in arr)` iterates which kind of value? Numbers? Strings?
//      Does it walk the prototype chain?
//   2. Arithmetic on those keys: `key + 1` when key is a string — what is
//      "0" + 1 ? And then `arr[key + 1]` …?
//   3. Once Array.prototype gets an extra property (`addTax`), what extra
//      keys appear in a for…in? Was this list ever safe?
//
// EXPECTED CORRECT BEHAVIOR:
//   - "Total" sums every numeric value in `prices` once, giving 60.
//   - The "Doubled" list shows each price * 2 in the same order.
//   - Adding the helper does not change either number or list.
//
// ACTUAL (buggy) BEHAVIOR: total prints "0102030" (string concatenation);
//   the doubled list contains a stray "addTax" entry; and items are
//   processed in surprising order after the helper is installed.
// =============================================================================

const prices = [10, 20, 30];

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Prices</h1>
    <p>Total: <strong id="total"></strong></p>
    <ol id="doubled"></ol>
    <button id="install">Install Array.prototype.addTax</button>
    <button id="rerender">Re-render</button>
  </main>
`;

function render() {
  let total = '';            // BUG: starts as a string, so += concatenates.
  const doubled = document.getElementById('doubled');
  doubled.innerHTML = '';
  // BUG: for…in over an array yields property KEYS as strings (and walks
  //      up the prototype chain). After the "Install" button runs, the
  //      key `"addTax"` shows up here too.
  for (const i in prices) {
    total += prices[i];      // string + number → "010", "01020", …
    const li = document.createElement('li');
    li.textContent = `${i} → ${prices[i] * 2}`;
    doubled.appendChild(li);
  }
  document.getElementById('total').textContent = total;
}

document.getElementById('install').onclick = () => {
  // Pretend a library added this. It is enumerable by default.
  Array.prototype.addTax = function (rate) { return this.map((v) => v * (1 + rate)); };
  console.log('Installed addTax');
};
document.getElementById('rerender').onclick = render;
render();
