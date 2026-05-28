// =============================================================================
// TASK 08 — == Coercion Traps  (STATIC / code-review style)
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: static — the code runs without crashing and *seems* to work for the
//   default values. The bugs are subtle correctness issues that a careful
//   code review must catch. Do not just run it and call it done.
//
// A "settings form" validates fields with `==`, checks "is this in the
// allowed list?" with `==`, and shows a "Welcome back!" banner if the user
// has a name. Several rules look fine, but break for legitimate user input
// (e.g. age=0 for a baby account, name="" for an anonymous guest).
//
// CHECKLIST (look for ALL of these — there are FOUR):
//   1. `count == false` — what values of `count` make this true? (Hint:
//      think about `0`, `""`, `null`, `undefined`, `false`, `[]`, …)
//   2. `value == null` — is that the right check, or accidentally permissive?
//   3. `[] == ![]` — what does this evaluate to, and does the in-list check
//      `allowed.indexOf(x) == false` actually mean "not present"?
//   4. `==` on objects in `pick` — when does it ever return true?
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - `validateAge(0)` returns OK (a 0-year-old IS a valid age value).
//   - `welcomeBanner("")` does NOT show the banner.
//   - `isAllowed(0, [0, 1, 2])` returns true.
//   - `pick(profile, ['name'])` returns `{ name: profile.name }`.
//
// ACTUAL (buggy) BEHAVIOR: validateAge(0) rejects ("must provide a value");
// welcomeBanner("") shows "Welcome back, !"; isAllowed(0, [0,1,2]) is false;
// pick can pull the wrong key when two values stringify the same.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Settings (static analysis exercise)</h1>
    <pre id="out" style="background:#eef; padding: 12px"></pre>
  </main>
`;

// BUG #1: `age == false` is true for 0, "", null, undefined, false, []. A
//          legitimate age of 0 wrongly trips the "must provide a value" branch.
function validateAge(age) {
  if (age == false) return 'must provide a value';
  if (age < 0) return 'must be non-negative';
  return 'OK';
}

// BUG #2: `name == null` is true only for null/undefined — so empty string
//          slips through and the banner reads "Welcome back, !".
function welcomeBanner(name) {
  if (name == null) return '';
  return `Welcome back, ${name}!`;
}

// BUG #3: `indexOf` returns -1 when not found; comparing to `false` makes
//          this true ONLY for index 0 (because -1 == false is false but 0
//          == false is true). So "in the list" only works for the FIRST
//          element of the list — fragile and wrong.
function isAllowed(x, list) {
  return list.indexOf(x) == false;
}

// BUG #4: keys is an array of strings; `keys == k` is comparing an Array to
//          a string — which JS coerces by Array.prototype.toString() (i.e.
//          comma-joins). So `['name'] == 'name'` is TRUE, but `['a','b'] ==
//          'a,b'` is also true — a coincidental string match passes.
function pick(obj, keys) {
  const out = {};
  for (const k in obj) {
    if (keys == k) out[k] = obj[k];
  }
  return out;
}

const out = document.getElementById('out');
out.textContent = [
  `validateAge(0)        → ${validateAge(0)}                  (expected OK)`,
  `validateAge(undefined)→ ${validateAge(undefined)}           (expected must provide a value)`,
  `welcomeBanner("Ada")  → ${JSON.stringify(welcomeBanner('Ada'))}`,
  `welcomeBanner("")     → ${JSON.stringify(welcomeBanner(''))}  (expected "")`,
  `isAllowed(0, [0,1,2]) → ${isAllowed(0, [0, 1, 2])}  (expected true)`,
  `isAllowed(9, [0,1,2]) → ${isAllowed(9, [0, 1, 2])}  (expected false)`,
  `pick({name:'a',age:1}, ['name']) → ${JSON.stringify(pick({ name: 'a', age: 1 }, ['name']))}`,
].join('\n');
