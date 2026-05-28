// =============================================================================
// SOLUTION 04 — Mutating a Shared Object Argument
// =============================================================================
//
// Two distinct mutation bugs: (1) the helper mutated the base profile in
// place; (2) the history array stored references to that one mutated
// profile so every entry showed the latest state. Both are fixed by
// returning fresh objects (a shallow + a nested copy of `prefs`).
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

// FIX #1: Return a NEW object. The helper now treats `target` as read-only
//         and produces a shallow copy with the overrides applied.
// FIX #2: `prefs` is nested, so a shallow spread would still share the
//         inner object — spread it explicitly to break the alias.
function applyOverrides(target, overrides = {}) {
  return {
    ...target,
    ...overrides,
    prefs: { ...target.prefs, ...(overrides.prefs ?? {}) },
  };
}

function render(overrides) {
  const profile = applyOverrides(baseProfile, overrides);
  document.getElementById('card').textContent = JSON.stringify(profile, null, 2);
  // FIX #3: Push a structural copy so future renders can't mutate this
  //         snapshot. With FIX #1+#2 the helper already returns a fresh
  //         object — but the explicit copy here documents the intent.
  history.push({ ...profile, prefs: { ...profile.prefs } });
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
