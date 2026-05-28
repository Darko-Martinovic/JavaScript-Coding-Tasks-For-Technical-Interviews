// =============================================================================
// TASK 02 — Lost `this` When Passing a Method
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser — open the console)
//
// A small `Greeter` class drives a UI: clicking "Greet" should append the
// current greeting to a list, and a 1-second delayed greet should fire after
// clicking "Delay". The greeting can be changed in the input.
//
// It misbehaves in THREE separate ways. The console will show TypeErrors
// (`Cannot read properties of undefined`) — that's a hint, not the only bug.
//
// THINGS TO SCRUTINISE:
//   1. When a method is passed bare (e.g. `setTimeout(g.sayHi, ...)` or
//      `button.addEventListener('click', g.sayHi)`), what is `this` inside
//      the function when the runtime later invokes it?
//   2. Counter strategies: `bind` returns a NEW function each call. If you
//      pass `g.sayHi.bind(g)` to addEventListener and then later try to
//      removeEventListener with the same expression, do they match?
//   3. Class-field arrows vs prototype methods — which one already has a
//      bound `this`?
//
// EXPECTED CORRECT BEHAVIOR:
//   - "Greet" appends `Hi, <name>!` to the list (no TypeError).
//   - "Delay" appends the same message after ~1s.
//   - "Stop greeting" detaches the click handler so further clicks do
//     nothing. (Currently it silently fails.)
//
// ACTUAL (buggy) BEHAVIOR: clicking Greet throws; Delay throws after 1s;
//   Stop greeting appears to do nothing — the listener stays bound.
// =============================================================================

class Greeter {
  constructor(name) {
    this.name = name;
  }
  // BUG: prototype method — `this` is the call site's receiver, which is
  //      lost when this method is passed as a bare callback.
  sayHi() {
    const li = document.createElement('li');
    li.textContent = `Hi, ${this.name}!`;
    document.getElementById('log').appendChild(li);
  }
}

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Greeter</h1>
    <p>Name: <input id="name" value="Ada" /></p>
    <button id="greet">Greet</button>
    <button id="delay">Delay 1s</button>
    <button id="stop">Stop greeting</button>
    <ul id="log"></ul>
  </main>
`;

const g = new Greeter('Ada');
document.getElementById('name').addEventListener('input', (e) => {
  g.name = e.target.value;
});

const btn = document.getElementById('greet');

// BUG: `g.sayHi` is passed bare. When the DOM later invokes it, `this` is
//      the element (or undefined under strict mode in module scripts).
btn.addEventListener('click', g.sayHi);

// BUG: a fresh bound function every click — and we then try to remove a
//      DIFFERENT fresh bound function below, which never matches.
document.getElementById('delay').addEventListener('click', () => {
  setTimeout(g.sayHi, 1000);
});

document.getElementById('stop').addEventListener('click', () => {
  btn.removeEventListener('click', g.sayHi.bind(g));
});
