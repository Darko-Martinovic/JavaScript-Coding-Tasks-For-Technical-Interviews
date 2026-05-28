// =============================================================================
// SOLUTION 20 — removeEventListener With a Different Fn Ref
// =============================================================================
//
// removeEventListener matches by identity, type, and capture flag. `.bind()`
// and arrow-wrappers both create NEW function objects, so a later remove
// with a fresh wrapper compares two different references and silently does
// nothing. The fix is to store the EXACT reference you registered (and use
// it on both sides), or use AbortController so an abort tears them all down
// regardless of references.
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
  // FIX #1: class-field arrow gives one stable, pre-bound reference per
  //         instance. No need for .bind() at the call site.
  handle = () => {
    log.textContent += `${this.prefix} fired\n`;
  };
}
const l = new Logger();

const spam = document.getElementById('spam');
// FIX #2: pass `l.handle` directly. Both add and remove now refer to the
//         SAME function object on the instance.
spam.addEventListener('click', l.handle);

document.getElementById('stop').onclick = () => {
  spam.removeEventListener('click', l.handle);
  log.textContent += '(stopped)\n';
};

// FIX #3: save the exact wrapper you registered, and pass that same
//         reference to remove. (Equivalently: register `onResize` itself.)
function onResize() { log.textContent += 'window resized\n'; }
window.addEventListener('resize', onResize);

document.getElementById('unbind').onclick = () => {
  window.removeEventListener('resize', onResize);
  log.textContent += '(unbound window)\n';
};
