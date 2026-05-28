// =============================================================================
// TASK 19 — Listener Registered Every Mount
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (handler stacks; visible click multiplier)
//
// A naïve "view router" calls `mountView(name)` whenever the user
// navigates. Each mount renders the view AND wires up a window resize
// listener for that view. Navigating between views keeps the previous
// listeners alive — clicking the counter button N times after N
// navigations triggers the handler N* times.
//
// THINGS TO SCRUTINISE:
//   1. `mountView` adds a window listener AND a click listener every
//      call. Does it ever remove the prior ones?
//   2. The "Currently bound" counter at the bottom — how do you keep
//      track of which handlers are alive? Hint: store the references
//      you registered.
//   3. The click handler reads from `state.count` directly — when the
//      previous mount's handler runs ALSO, it bumps state too.
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - Navigating Home → About → Home and clicking "Bump" once shows
//     `count = 1` (a single handler fired).
//   - The "Bound listeners" counter stays ≤ 2 (one window resize, one
//     click) regardless of navigation count.
//
// ACTUAL (buggy) BEHAVIOR: after three navigations, clicking Bump once
//   shows `count = 3`. The bound-listener counter climbs monotonically.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <nav>
      <button id="home">Home</button>
      <button id="about">About</button>
    </nav>
    <h1 id="title"></h1>
    <button id="bump">Bump</button>
    <p>count = <strong id="count">0</strong></p>
    <p>Bound listeners: <strong id="bound">0</strong> (each navigation should not increase this)</p>
  </main>
`;

const state = { count: 0 };

let listenerCount = 0;
function trackAdd() {
  listenerCount += 1;
  document.getElementById('bound').textContent = String(listenerCount);
}

// BUG: every call to mountView adds a fresh click and resize listener
//      without removing the previous one(s). After three navigations,
//      one click fires three handlers.
function mountView(name) {
  document.getElementById('title').textContent = name;

  document.getElementById('bump').addEventListener('click', () => {
    state.count += 1;
    document.getElementById('count').textContent = String(state.count);
  });
  trackAdd();

  window.addEventListener('resize', () => console.log(`[${name}] resize`));
  trackAdd();
}

document.getElementById('home').onclick = () => mountView('Home');
document.getElementById('about').onclick = () => mountView('About');

mountView('Home');
