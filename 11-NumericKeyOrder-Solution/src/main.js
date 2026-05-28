// =============================================================================
// SOLUTION 11 — Object.keys Order with Numeric Strings
// =============================================================================
//
// The spec is unambiguous: integer-indexed keys (strings that round-trip
// through ToUint32 without changing) come first in numeric order, then
// other string keys in insertion order. If you need insertion order, you
// have ONE of two correct options: (a) prefix keys so they aren't integer
// indices, or (b) use a Map (which preserves insertion order for any key).
// This solution uses (b).
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Records (paginated)</h1>
    <button id="add">Add record</button>
    <button id="del3">Delete id 3</button>
    <h3>Page 1 (size 3)</h3>
    <ol id="page"></ol>
    <h3>All keys in order</h3>
    <pre id="keys"></pre>
  </main>
`;

// FIX #1: A Map preserves insertion order for ANY key (including numeric
//         strings or numbers). Plain objects sort integer-indexed string
//         keys numerically first — exactly what bit us here.
const store = new Map();
let nextId = 1;

store.set('100', { name: 'Alpha' });
store.set('200', { name: 'Beta' });
nextId = 3;
store.set(String(nextId), { name: 'Gamma' }); nextId++;

// FIX #2: Map exposes ordered iteration via .entries() (and .keys() /
//         .values()). No sort, no key-coercion surprises.
function paginate(page, size) {
  const entries = [...store.entries()];
  const start = (page - 1) * size;
  return entries.slice(start, start + size).map(([id, r]) => ({ id, ...r }));
}

function render() {
  const page = document.getElementById('page');
  page.innerHTML = '';
  for (const r of paginate(1, 3)) {
    const li = document.createElement('li');
    li.textContent = `${r.id} → ${r.name}`;
    page.appendChild(li);
  }
  document.getElementById('keys').textContent = [...store.keys()].join(', ');
}

document.getElementById('add').onclick = () => {
  // FIX #3 (related): with a Map, a new key — numeric-string or not —
  //         is appended in insertion order, so it lands at the END.
  store.set(String(nextId), { name: `Δ-${nextId}` });
  nextId++;
  render();
};
document.getElementById('del3').onclick = () => {
  store.delete('3');
  render();
};
render();
