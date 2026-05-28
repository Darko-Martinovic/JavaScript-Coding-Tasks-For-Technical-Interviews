// =============================================================================
// SOLUTION 19 — Listener Registered Every Mount
// =============================================================================
//
// Two complementary patterns: (1) tear down the previous mount before
// starting a new one — store the handler references and call
// removeEventListener; (2) use AbortController so a single .abort() rips
// down every listener registered with that signal.
// This solution uses AbortController; it's the modern idiomatic answer.
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
function trackRemove(n) {
  listenerCount -= n;
  document.getElementById('bound').textContent = String(listenerCount);
}

// FIX #1: keep a reference to the current mount's AbortController. Every
//         listener registers with its signal, so calling .abort() on the
//         previous controller rips the old listeners off in one shot.
let currentController = null;

function mountView(name) {
  // FIX #2: tear down the previous mount BEFORE registering the new one.
  if (currentController) { currentController.abort(); trackRemove(2); }
  currentController = new AbortController();
  const { signal } = currentController;

  document.getElementById('title').textContent = name;

  document.getElementById('bump').addEventListener('click', () => {
    state.count += 1;
    document.getElementById('count').textContent = String(state.count);
  }, { signal });
  trackAdd();

  window.addEventListener('resize', () => console.log(`[${name}] resize`), { signal });
  trackAdd();
}

document.getElementById('home').onclick = () => mountView('Home');
document.getElementById('about').onclick = () => mountView('About');

mountView('Home');
