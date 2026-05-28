// =============================================================================
// TASK 20 — removeEventListener With a Different Fn Ref
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (Stop button silently does nothing)
//
// A "spam" button keeps logging on every click; a Stop button is
// supposed to detach the handler. There's also a window listener that
// should detach on "Unbind window". Neither detaches.
//
// THINGS TO SCRUTINISE:
//   1. What does `.bind()` return? Two calls to `fn.bind(this)` — are
//      the returned functions === to each other?
//   2. addEventListener('click', () => handler()) — passing an arrow
//      wrapper means the actually-registered function is THAT arrow,
//      not `handler`. Does `remove(... handler)` ever match it?
//   3. The window listener: same problem, plus the bound function isn't
//      saved anywhere — there's no way to look it up later.
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - Click Spam a few times → each click logs.
//   - Click Stop → no further clicks log.
//   - Resize window → logs "window resized".
//   - Click "Unbind window" → no more resize logs.
//
// ACTUAL (buggy) BEHAVIOR: Stop is a no-op (Spam keeps logging after
//   Stop); Unbind window is a no-op (resize keeps logging).
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Listener detach</h1>
    <button id="spam">Spam</button>
    <button id="stop">Stop</button>
    <button id="unbind">Unbind window</button>
    <pre id="log"></pre>
  </main>
`;

const log = document.getElementById('log');

class Logger {
  prefix = '[click]';
  handle() {
    log.textContent += `${this.prefix} fired\n`;
  }
}
const l = new Logger();

const spam = document.getElementById('spam');
// BUG 1: `.bind(l)` returns a fresh function. We never saved this
//        reference, so the matching remove later can't find it.
spam.addEventListener('click', l.handle.bind(l));

document.getElementById('stop').onclick = () => {
  // BUG 2: a SECOND .bind(l) — totally different function reference.
  spam.removeEventListener('click', l.handle.bind(l));
  log.textContent += '(tried to stop)\n';
};

// BUG 3: same issue with an arrow wrapper — the registered function is
//        the arrow, not `onResize`.
function onResize() { log.textContent += 'window resized\n'; }
window.addEventListener('resize', () => onResize());

document.getElementById('unbind').onclick = () => {
  window.removeEventListener('resize', onResize);
  log.textContent += '(tried to unbind window)\n';
};
