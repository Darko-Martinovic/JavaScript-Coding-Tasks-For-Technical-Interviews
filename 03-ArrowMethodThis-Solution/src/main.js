// =============================================================================
// SOLUTION 03 — Arrow Where Dynamic `this` Was Needed
// =============================================================================
//
// Arrows have no own `this` — they capture lexical scope. That's wrong both
// for DOM event handlers (which want `this` = the element) and for prototype
// methods (which want `this` = the receiver of the call). Use a regular
// function in both places.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <style>
      .tag { margin: 4px; padding: 6px 10px; border: 1px solid #ccc; }
      .tag.active { background: #ffd54f; }
    </style>
    <h1>Tag cloud</h1>
    <div id="tags">
      <button class="tag">js</button>
      <button class="tag">dom</button>
      <button class="tag">async</button>
      <button class="tag">closures</button>
    </div>
    <hr/>
    <p>Count: <strong id="count">0</strong></p>
    <button id="bump">Bump</button>
    <button id="print">Print count</button>
  </main>
`;

document.querySelectorAll('.tag').forEach((tag) => {
  // FIX #1: Regular `function` callback so `this` is the element the DOM
  //         invoked it on. (Equivalently: `(e) => e.currentTarget.classList…`.)
  tag.addEventListener('click', function () {
    this.classList.toggle('active');
  });
});

function Counter() {
  this.count = 0;
}
// FIX #2: Regular `function` on the prototype. Now calling `c.bump()` invokes
//         it with `this === c`, so `this.count` is the instance field.
Counter.prototype.bump = function () {
  this.count += 1;
  document.getElementById('count').textContent = String(this.count);
};
// FIX #3: Same fix for print(). Arrow on a prototype always points at the
//         enclosing module scope — there's no situation where it's right.
Counter.prototype.print = function () {
  console.log(`count=${this.count}`);
};

const c = new Counter();
document.getElementById('bump').addEventListener('click', () => c.bump());
document.getElementById('print').addEventListener('click', () => c.print());
