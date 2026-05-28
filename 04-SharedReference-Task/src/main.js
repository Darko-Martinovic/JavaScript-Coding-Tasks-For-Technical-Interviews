// =============================================================================
// TASK 04 — Mutating a Shared Object Argument
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves)
//
// A trivial "user card" builder takes a base profile and a set of
// per-render overrides, and renders a card. The base profile should NEVER
// change across renders — it's the source of truth — but it does.
//
// THINGS TO SCRUTINISE:
//   1. `applyOverrides` mutates its first argument. Who's the "first
//      argument" at each call site? Is the SAME object reaching that
//      function more than once?
//   2. The `defaults` parameter default value — when is the default object
//      evaluated, and is it the SAME object across calls?
//   3. The "snapshot" array push: does it store a reference or a copy?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Clicking "Make Admin" renders an admin card (role=admin).
//   - Clicking "Reset" renders the original profile (role=user, prefs={}).
//   - The "History" list shows each rendered snapshot, frozen at its time.
//
// ACTUAL (buggy) BEHAVIOR: after Make Admin, Reset still shows role=admin
//   because the base profile itself was mutated. The history list also
//   "rewrites itself" — every entry shows the latest values.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>User card</h1>
    <pre id="card" style="background:#eef; padding: 12px"></pre>
    <button id="admin">Make Admin</button>
    <button id="dark">Dark mode</button>
    <button id="reset">Reset</button>
    <h3>History (oldest → newest)</h3>
    <ol id="history"></ol>
  </main>
`;

const baseProfile = { name: 'Ada', role: 'user', prefs: { theme: 'light' } };
const history = [];

// BUG: mutates `target` in place and ALSO mutates its nested `prefs`. The
//      caller passes `baseProfile` directly, so this clobbers it forever.
function applyOverrides(target, overrides = {}) {
  for (const k of Object.keys(overrides)) {
    if (k === 'prefs') {
      Object.assign(target.prefs, overrides.prefs);
    } else {
      target[k] = overrides[k];
    }
  }
  return target;
}

function render(overrides) {
  const profile = applyOverrides(baseProfile, overrides);
  document.getElementById('card').textContent = JSON.stringify(profile, null, 2);
  // BUG: pushes the SAME object reference every time. All history entries
  //      point at the one mutated profile.
  history.push(profile);
  const ol = document.getElementById('history');
  ol.innerHTML = '';
  for (const snap of history) {
    const li = document.createElement('li');
    li.textContent = JSON.stringify(snap);
    ol.appendChild(li);
  }
}

document.getElementById('admin').onclick = () => render({ role: 'admin' });
document.getElementById('dark').onclick = () => render({ prefs: { theme: 'dark' } });
document.getElementById('reset').onclick = () => render({});

render({});
