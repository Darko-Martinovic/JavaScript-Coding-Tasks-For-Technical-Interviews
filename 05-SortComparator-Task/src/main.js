// =============================================================================
// TASK 05 — Array .sort() Without a Comparator
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and produces visibly wrong output)
//
// A small leaderboard renders players sorted by score (descending). There's
// also a "raw scores" display below that should show the ORIGINAL unsorted
// order. Both are wrong.
//
// THINGS TO SCRUTINISE:
//   1. What does `.sort()` with no argument do to numbers? Try
//      `[2, 10, 1].sort()` in the console.
//   2. `.sort()` returns the array — but does it also mutate the original?
//      Compare `players` before and after sorting.
//   3. When two players tie on score, what determines their order? Is the
//      result stable across renders?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Leaderboard shows highest score first, lowest last.
//   - On ties, players are ordered alphabetically by name.
//   - The "Raw input" block shows the players in their ORIGINAL declaration
//     order (Ada, Brent, Cora, Dax, Ed, Faye) regardless of how many times
//     you click "Re-sort".
//
// ACTUAL (buggy) BEHAVIOR: leaderboard treats scores as strings ("100" sorts
//   before "20"); the "Raw input" block changes on every sort; and the order
//   of tied players flips between clicks.
// =============================================================================

const players = [
  { name: 'Ada',   score: 100 },
  { name: 'Brent', score: 20  },
  { name: 'Cora',  score: 5   },
  { name: 'Dax',   score: 20  },
  { name: 'Ed',    score: 200 },
  { name: 'Faye',  score: 5   },
];

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Leaderboard</h1>
    <ol id="board"></ol>
    <button id="resort">Re-sort</button>
    <h3>Raw input (should be unchanged)</h3>
    <pre id="raw" style="background:#eef; padding: 12px"></pre>
  </main>
`;

function rank(list) {
  // BUG 1: no comparator → lexicographic. "100" < "20" so 100 ranks below 20.
  // BUG 2: .sort() mutates `list` in place, so the raw display below
  //        permanently loses its original order after the first call.
  return list.sort().reverse();
}

function render() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (const p of rank(players)) {
    const li = document.createElement('li');
    li.textContent = `${p.name}: ${p.score}`;
    board.appendChild(li);
  }
  document.getElementById('raw').textContent =
    players.map((p) => `${p.name}=${p.score}`).join(', ');
}

document.getElementById('resort').onclick = render;
render();
