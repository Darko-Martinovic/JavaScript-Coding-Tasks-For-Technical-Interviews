// =============================================================================
// TASK 03 — Arrow Where Dynamic `this` Was Needed
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves)
//
// A simple "tag cloud": each <button class="tag"> in a list should toggle
// its OWN `active` CSS class when clicked. A constructor-style "Counter"
// also exposes a method that should print the instance's count. Each piece
// uses `this` differently — and the wrong choice was made each time.
//
// THINGS TO SCRUTINISE:
//   1. `addEventListener('click', handler)` calls `handler` with `this` set
//      to the element. Does an arrow function HAVE its own `this`?
//   2. When `Counter.prototype.print = () => ...`, what `this` does the
//      arrow see when you call `c.print()`?
//   3. `document.querySelectorAll(...)` returns a NodeList. Does it have
//      `.map()`? Does iterating with `forEach((el) => …)` make `this`
//      mean what the handler body expects?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Clicking a tag toggles `active` on that one tag only.
//   - "Print count" logs e.g. "count=3" reflecting clicks of "Bump".
//
// ACTUAL (buggy) BEHAVIOR: clicking a tag toggles `active` on the wrong
//   thing (the window/global) so nothing visibly changes; "Print count"
//   logs `undefined`.
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
  // BUG: arrow has no own `this`; here `this` is the module-level value,
  //      not the clicked element. The class toggle silently no-ops.
  tag.addEventListener('click', () => {
    this.classList.toggle('active');
  });
});

function Counter() {
  this.count = 0;
}
// BUG: prototype methods called as `c.method()` rely on dynamic `this`.
//      An arrow function captures the surrounding (module) `this` instead,
//      so `this.count` is undefined.
Counter.prototype.bump = () => {
  this.count += 1;
  document.getElementById('count').textContent = String(this.count);
};
Counter.prototype.print = () => {
  console.log(`count=${this.count}`);
};

const c = new Counter();
document.getElementById('bump').addEventListener('click', () => c.bump());
document.getElementById('print').addEventListener('click', () => c.print());
