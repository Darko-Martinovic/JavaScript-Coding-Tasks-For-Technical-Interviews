// =============================================================================
// SOLUTION 06 — for…in Over an Array
// =============================================================================
//
// Three fixes: use a numeric accumulator; iterate the values (or numeric
// indices) explicitly so prototype keys don't leak in; and even if you keep
// for…in, gate the body on hasOwnProperty so prototype enumerables don't
// poison your totals.
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
  // FIX #1: Numeric zero, not a string. With the string seed, every += was
  //         a concatenation: "" + 10 → "10" → "1020" → "102030".
  let total = 0;
  const doubled = document.getElementById('doubled');
  doubled.innerHTML = '';
  // FIX #2: for…of over the values, which (a) yields actual numbers, not
  //         stringified keys, and (b) does NOT enumerate prototype
  //         properties — so `addTax` no longer sneaks in.
  // FIX #3: Use `.entries()` when you also need an index, so the index is a
  //         real number (not "0", "1", "2" coerced from for…in).
  for (const [i, price] of prices.entries()) {
    total += price;
    const li = document.createElement('li');
    li.textContent = `${i} → ${price * 2}`;
    doubled.appendChild(li);
  }
  document.getElementById('total').textContent = String(total);
}

document.getElementById('install').onclick = () => {
  Array.prototype.addTax = function (rate) { return this.map((v) => v * (1 + rate)); };
  console.log('Installed addTax');
};
document.getElementById('rerender').onclick = render;
render();
