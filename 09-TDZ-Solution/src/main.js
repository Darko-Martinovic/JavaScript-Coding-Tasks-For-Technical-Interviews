// =============================================================================
// SOLUTION 09 — let / const Hoisting & TDZ
// =============================================================================
//
// `let` and `const` are hoisted to the top of their block but stay in the
// Temporal Dead Zone until the declaration executes. Reading them earlier
// throws. The fix is structural: declare bindings BEFORE the code that
// uses them, and never accidentally shadow an outer name from inside the
// same block.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1 id="title"></h1>
    <p>theme = <strong id="theme"></strong></p>
    <p>dark mode? <strong id="dark"></strong></p>
  </main>
`;

// FIX #1: Declare `userName` and `theme` (and the `isDark` arrow) BEFORE
//         any code that reads them. With `var` they would have hoisted to
//         `undefined`; with `let`/`const` they are in TDZ until this point.
const userName = 'Ada';
const theme = 'dark';
const isDark = () => theme === 'dark';

function getDisplayName() {
  return userName;
}

function applyTheme(currentTheme) {
  // FIX #2: don't shadow the outer name with a same-named `let` inside the
  //         same block — pass the value in (or use a distinct local name).
  //         The shadow used to put the inner `theme` in TDZ for the
  //         console.log above it, which threw.
  console.log('current theme in applyTheme is', currentTheme);
  return currentTheme;
}

// FIX #3: Calls happen AFTER every binding is initialised. The buggy code
//         called getDisplayName() and isDark() while their backing `let` /
//         `const` were still in TDZ.
document.getElementById('title').textContent = `Welcome, ${getDisplayName()}`;
document.getElementById('theme').textContent = theme;
document.getElementById('dark').textContent = isDark() ? 'yes' : 'no';
applyTheme(theme);
