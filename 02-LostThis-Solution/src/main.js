// =============================================================================
// SOLUTION 02 — Lost `this` When Passing a Method
// =============================================================================
//
// Three fixes, each annotated `// FIX #n`. The crux: a method ripped off its
// object loses its receiver, and `.bind()` returns a fresh function each call.
// =============================================================================

class Greeter {
  constructor(name) {
    this.name = name;
  }
  // FIX #1: Class-field arrow. The function is created per instance with
  //         `this` lexically bound to that instance, so passing `g.sayHi` as
  //         a callback still resolves `this.name` correctly.
  sayHi = () => {
    const li = document.createElement('li');
    li.textContent = `Hi, ${this.name}!`;
    document.getElementById('log').appendChild(li);
  };
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

// FIX #2: Because sayHi is already bound (FIX #1), passing it bare works.
//         If we had kept the prototype method, we would need
//         `btn.addEventListener('click', () => g.sayHi())` or `.bind(g)`
//         stored in a variable so remove can match it.
btn.addEventListener('click', g.sayHi);

document.getElementById('delay').addEventListener('click', () => {
  // setTimeout(g.sayHi, 1000) works now because sayHi is bound (FIX #1).
  setTimeout(g.sayHi, 1000);
});

// FIX #3: Remove with the SAME function reference that was registered. The
//         old code called `g.sayHi.bind(g)` again, which returns a brand-new
//         function each call — never the one that was added.
document.getElementById('stop').addEventListener('click', () => {
  btn.removeEventListener('click', g.sayHi);
});
