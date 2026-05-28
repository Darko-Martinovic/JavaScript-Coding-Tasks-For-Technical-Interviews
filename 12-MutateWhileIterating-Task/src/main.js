// =============================================================================
// TASK 12 — Splice Inside forEach
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (the displayed list and counts are wrong)
//
// A simple TODO list:
//   - "Clear done" should remove every item where done=true.
//   - "Apply suffix" should append " ✓" to every remaining title.
//   - The header should show the live count.
//
// THINGS TO SCRUTINISE:
//   1. `forEach` walks indices 0..N-1. What happens if the callback
//      removes the current index from the underlying array? Does the
//      next index point at the item you'd expect?
//   2. The classic for-loop with `i < arr.length` evaluates `arr.length`
//      on EVERY iteration. The version below caches it — what changes?
//   3. There's also a `while`-loop suffix routine where the index is
//      always bumped, even when an item was deleted on this iteration.
//
// EXPECTED CORRECT BEHAVIOR:
//   - With initial items [a✗ b✓ c✓ d✗ e✓], "Clear done" leaves [a, d].
//   - "Apply suffix" turns [a, d] into [a ✓, d ✓].
//   - The header count matches the displayed list size.
//
// ACTUAL (buggy) BEHAVIOR: after "Clear done" the list is [a, c, d];
//   the suffix run leaves SOME entries unsuffixed; and the header count
//   can desync from what is actually shown.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Todos (<span id="count"></span>)</h1>
    <ul id="list"></ul>
    <button id="clear">Clear done</button>
    <button id="suffix">Apply suffix</button>
  </main>
`;

const items = [
  { title: 'a', done: false },
  { title: 'b', done: true  },
  { title: 'c', done: true  },
  { title: 'd', done: false },
  { title: 'e', done: true  },
];

function render() {
  const list = document.getElementById('list');
  list.innerHTML = '';
  for (const it of items) {
    const li = document.createElement('li');
    li.textContent = it.title + (it.done ? ' (done)' : '');
    list.appendChild(li);
  }
  document.getElementById('count').textContent = items.length;
}

document.getElementById('clear').onclick = () => {
  // BUG: splicing during forEach makes the iterator skip the element
  //      that shifted into the position you just removed from.
  items.forEach((it, i) => {
    if (it.done) items.splice(i, 1);
  });
  render();
};

document.getElementById('suffix').onclick = () => {
  // BUG: length is cached before any mutation, but inside the loop we
  //      could delete an item conditionally; without re-reading length
  //      AND without adjusting `i`, items are skipped or read past end.
  const len = items.length;
  let i = 0;
  while (i < len) {
    if (items[i] === undefined) { i++; continue; }
    items[i].title = items[i].title + ' ✓';
    if (items[i].title.startsWith('a')) {
      // contrived secondary mutation that pre-removes a node
      items.splice(i, 1);
    }
    i++;                       // BUG: still bumps even after a splice
  }
  render();
};

render();
