// =============================================================================
// SOLUTION 05 — Array .sort() Without a Comparator
// =============================================================================
//
// Three fixes: pass a numeric comparator; sort a COPY so the input is
// preserved; add a stable secondary sort by name for ties.
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
  // FIX #1: Copy with .slice() (or [...list]) before sorting so the caller's
  //         array is preserved. The buggy code used .sort() on the original
  //         and the "Raw input" panel slowly turned into the sorted output.
  // FIX #2: Pass a numeric comparator so 100 > 20 (the default comparator
  //         converts to string, which makes "100" sort BEFORE "20").
  // FIX #3: Secondary tiebreaker by name keeps the order of equal-score
  //         players deterministic across re-sorts.
  return list.slice().sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
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
