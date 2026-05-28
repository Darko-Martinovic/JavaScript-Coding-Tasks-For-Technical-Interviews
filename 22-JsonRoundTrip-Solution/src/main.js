// =============================================================================
// SOLUTION 22 — JSON Round-Trip Drops undefined / Date / Functions
// =============================================================================
//
// The right tool here is `structuredClone`, which preserves Date, Map, Set,
// RegExp, ArrayBuffer, typed arrays, and circular refs — but still does
// not clone functions (functions are NOT cloneable, by design). If your
// payload has methods, clone the data and re-attach behavior, or rewrite
// methods as standalone functions taking the data as a parameter.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>JSON round-trip</h1>
    <pre id="out" style="background:#eef; padding: 12px"></pre>
  </main>
`;

const profile = {
  name: 'Ada',
  lastLogin: new Date(2024, 0, 1),
  settings: { theme: 'dark', notify: undefined },
  tags: new Set(['js', 'closures']),
  total() { return 42; },
};

// FIX #1: `structuredClone` handles Date and Set correctly. It still
//         can't clone functions (the spec excludes them) — so we strip
//         and re-attach.
function deepClone(x) {
  // FIX #2: pull off non-cloneable functions, clone the rest, then
  //         re-attach by reference. Explicit beats silent loss.
  const { total, ...rest } = x;
  const copy = structuredClone(rest);
  copy.total = total;
  return copy;
}

const copy = deepClone(profile);

const out = document.getElementById('out');
out.textContent = [
  `typeof copy.lastLogin       : ${typeof copy.lastLogin}     (expected: object — a Date)`,
  `copy.lastLogin instanceof Date: ${copy.lastLogin instanceof Date}`,
  `'notify' in copy.settings   : ${'notify' in copy.settings}   (expected: true)`,
  `typeof copy.total           : ${typeof copy.total}   (expected: function)`,
  `copy.tags constructor       : ${copy.tags.constructor.name}    (expected: Set)`,
].join('\n');
