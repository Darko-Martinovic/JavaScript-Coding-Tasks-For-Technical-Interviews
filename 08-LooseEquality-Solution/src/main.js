// =============================================================================
// SOLUTION 08 — == Coercion Traps
// =============================================================================
//
// The universal cure for these is: use `===` and write the predicate you
// actually mean. `== null` is occasionally idiomatic (it is the only safe
// double-equal in the language — true ONLY for null/undefined), but every
// other `==` here is a category error.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Settings (static analysis exercise)</h1>
    <pre id="out" style="background:#eef; padding: 12px"></pre>
  </main>
`;

// FIX #1: Mean what you mean. "missing" is null/undefined, not "falsy". A
//         legitimate age of 0 is now accepted.
function validateAge(age) {
  if (age == null) return 'must provide a value';  // == null is the only OK == here
  if (typeof age !== 'number' || Number.isNaN(age)) return 'must be a number';
  if (age < 0) return 'must be non-negative';
  return 'OK';
}

// FIX #2: Reject empty string explicitly. The original `== null` let "" pass.
function welcomeBanner(name) {
  if (name == null || name === '') return '';
  return `Welcome back, ${name}!`;
}

// FIX #3: `indexOf` returns -1 on miss; use `!== -1` (or `.includes` for
//         clarity). Comparing to `false` was nonsense — it accidentally
//         matched index 0 only.
function isAllowed(x, list) {
  return list.includes(x);
}

// FIX #4: Filter by membership in the keys array, not by accidental string
//         coercion. `.includes` does a strict comparison and is unambiguous.
function pick(obj, keys) {
  const out = {};
  for (const k of Object.keys(obj)) {
    if (keys.includes(k)) out[k] = obj[k];
  }
  return out;
}

const out = document.getElementById('out');
out.textContent = [
  `validateAge(0)        → ${validateAge(0)}                 (expected OK)`,
  `validateAge(undefined)→ ${validateAge(undefined)}           (expected must provide a value)`,
  `welcomeBanner("Ada")  → ${JSON.stringify(welcomeBanner('Ada'))}`,
  `welcomeBanner("")     → ${JSON.stringify(welcomeBanner(''))}            (expected "")`,
  `isAllowed(0, [0,1,2]) → ${isAllowed(0, [0, 1, 2])}             (expected true)`,
  `isAllowed(9, [0,1,2]) → ${isAllowed(9, [0, 1, 2])}            (expected false)`,
  `pick({name:'a',age:1}, ['name']) → ${JSON.stringify(pick({ name: 'a', age: 1 }, ['name']))}`,
].join('\n');
