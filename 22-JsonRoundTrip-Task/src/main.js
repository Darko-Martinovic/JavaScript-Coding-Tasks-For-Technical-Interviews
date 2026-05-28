// =============================================================================
// TASK 22 — JSON Round-Trip Drops undefined / Date / Functions  (STATIC)
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: static — every line runs without throwing, but the "clone" is
//   silently different from the original. The bugs only surface when
//   the consumer relies on a value's type, presence, or representation.
//
// `JSON.parse(JSON.stringify(x))` is a frequent shortcut for "deep
// clone". It is wrong (or at best lossy) for many real-world values.
//
// CHECKLIST (look for ALL of these):
//   1. `undefined` properties — what happens when JSON.stringify sees
//      one in an object? In an array slot?
//   2. `Date` instances — what does stringify do to them? What does
//      parse do with the result?
//   3. Methods (functions) on objects — survived the round-trip?
//   4. `Map`, `Set`, `BigInt`, `Symbol`-keyed properties — what comes
//      out the other side?
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - The cloned profile retains its `lastLogin` as a Date.
//   - The cloned settings retain `notify: undefined` (or have a defined
//     fallback — make the choice explicit, not silent).
//   - The cloned cart still has its `total()` method.
//   - The cloned tags Set is still a Set (or is converted explicitly).
//
// ACTUAL (buggy) BEHAVIOR: lastLogin becomes a STRING; notify silently
//   disappears (`'notify' in clone` is false); total() is missing; tags
//   becomes an empty object `{}`.
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

// BUG: JSON round-trip drops undefined and functions, turns Date into a
//      string, and converts Set/Map to {}.
function deepClone(x) {
  return JSON.parse(JSON.stringify(x));
}

const copy = deepClone(profile);

const out = document.getElementById('out');
out.textContent = [
  `typeof copy.lastLogin       : ${typeof copy.lastLogin}     (expected: object — a Date)`,
  `'notify' in copy.settings   : ${'notify' in copy.settings}   (expected: true)`,
  `typeof copy.total           : ${typeof copy.total}     (expected: function)`,
  `copy.tags constructor       : ${copy.tags?.constructor?.name}    (expected: Set)`,
].join('\n');
