// =============================================================================
// SOLUTION 12 — Splice Inside forEach
// =============================================================================
//
// Rule of thumb: never mutate the array you're walking, unless you're
// walking it from the end. The cleanest fix is functional: produce a new
// array with `filter` / `map` and reassign — no index bookkeeping at all.
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

let items = [
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
  // FIX #1: Build a new array with `filter`. No mutate-during-iterate, no
  //         index skipping. (Alternative for in-place removal: walk
  //         BACKWARDS so a splice doesn't move unvisited indices.)
  items = items.filter((it) => !it.done);
  render();
};

document.getElementById('suffix').onclick = () => {
  // FIX #2: `map` produces a new array, leaving the original untouched
  //         during iteration. No `len` cache to go stale, no `i++` to
  //         over-shoot after a splice.
  items = items.map((it) => ({ ...it, title: it.title + ' ✓' }));
  render();
};

render();
