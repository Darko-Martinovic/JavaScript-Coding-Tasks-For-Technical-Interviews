// =============================================================================
// TASK 11 — Object.keys Order with Numeric Strings  (STATIC / code-review)
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: static — the code runs, the output looks plausible, but the
//   contract ("first page = first ten in INSERTION order") is silently
//   broken whenever the keys are numeric strings. This bug rarely throws
//   in tests with named keys; it surfaces only with id-like keys.
//
// An in-memory "store" indexes records by id and a `paginate(page, size)`
// helper slices Object.values(...) for the UI. The author trusted that
// JS objects preserve insertion order — and that's almost true. The
// exception is precisely the case used here.
//
// CHECKLIST (THREE distinct issues — they reinforce each other):
//   1. The spec for `[[OwnPropertyKeys]]` says integer-indexed string keys
//      come FIRST in numeric ascending order, then the rest in insertion
//      order, then symbols. Which of the ids below are "integer-indexed"?
//   2. The keys are inserted as numeric strings ("100", "200", "3"). What
//      order does Object.keys return them in?
//   3. The `nextId` counter is "global-ish": it increments past a delete
//      but never reclaims, so any new record is added with a LARGER
//      numeric key. Does the new record appear at the end of page 1,
//      or has it just been silently re-paginated?
//
// EXPECTED CORRECT BEHAVIOR:
//   - `paginate(1, 3)` returns the FIRST THREE records by insertion order:
//     Alpha (added first), Beta, Gamma. New record after delete goes to
//     the END of the listing.
//
// ACTUAL (buggy) BEHAVIOR: insertion was Alpha→Beta→Gamma but the
//   first page shows Gamma, Alpha, Beta because "3" sorts before "100"
//   and "200" by numeric-key precedence.
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

const store = Object.create(null);
let nextId = 1;

// BUG: ids are inserted as numeric STRINGS (Object keys are always strings
//       unless they're symbols). "100" and "200" are integer-indexed keys
//       per the spec, so they will be ordered numerically BEFORE later
//       inserts whose id happens to be smaller (e.g. "3").
store['100'] = { name: 'Alpha' };
store['200'] = { name: 'Beta' };
nextId = 3;
store[String(nextId)] = { name: 'Gamma' }; nextId++;

// BUG: trusts Object.keys insertion order for numeric strings.
function paginate(page, size) {
  const keys = Object.keys(store);
  const start = (page - 1) * size;
  return keys.slice(start, start + size).map((k) => ({ id: k, ...store[k] }));
}

function render() {
  const page = document.getElementById('page');
  page.innerHTML = '';
  for (const r of paginate(1, 3)) {
    const li = document.createElement('li');
    li.textContent = `${r.id} → ${r.name}`;
    page.appendChild(li);
  }
  document.getElementById('keys').textContent = Object.keys(store).join(', ');
}

document.getElementById('add').onclick = () => {
  // BUG: any new record uses an id smaller than 100 / 200, so it jumps
  //       to the FRONT of the page-1 slice instead of the end of the list.
  store[String(nextId)] = { name: `Δ-${nextId}` };
  nextId++;
  render();
};
document.getElementById('del3').onclick = () => {
  delete store['3'];
  render();
};
render();
