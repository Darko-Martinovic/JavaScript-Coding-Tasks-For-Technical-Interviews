// =============================================================================
// TASK 09 — let / const Hoisting & TDZ
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (the page throws `ReferenceError` at load)
//
// A "config viewer" module renders three derived values: the user's
// display name, the default theme, and whether dark mode is "active".
// Author tried to be tidy by declaring helpers up top and config at the
// bottom — and now nothing renders.
//
// THINGS TO SCRUTINISE:
//   1. `function` declarations are hoisted; `let` / `const` declarations
//      are hoisted into the TEMPORAL DEAD ZONE. What happens if a function
//      reads a `let` that hasn't been initialized yet?
//   2. The block-scoped `let` inside `applyTheme` — does it shadow the
//      module-level `theme`? Try reading it from a console.log placed at
//      the very top of that block.
//   3. A function expression assigned to a `const` — is the binding usable
//      before that line runs?
//
// EXPECTED CORRECT BEHAVIOR:
//   - The page shows: "Welcome, Ada", "theme = dark", "dark mode? yes".
//
// ACTUAL (buggy) BEHAVIOR: a ReferenceError is thrown before the page
//   renders. (Open the console.)
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1 id="title"></h1>
    <p>theme = <strong id="theme"></strong></p>
    <p>dark mode? <strong id="dark"></strong></p>
  </main>
`;

// BUG: invoked before `userName` is initialised (line is further down).
//      `let` does not hoist its initializer like `var` did — accessing it
//      before the declaration throws a ReferenceError.
document.getElementById('title').textContent = `Welcome, ${getDisplayName()}`;

function getDisplayName() {
  return userName;       // TDZ violation
}

// BUG: the function expression is assigned to a const — that const is in
//      TDZ until this exact line, so any earlier call throws.
isDark();                // throws — called before defined

const isDark = () => theme === 'dark';

function applyTheme() {
  // BUG: the inner `let theme` shadows the outer one across the WHOLE
  //      block — so the console.log above this declaration is also in TDZ.
  console.log('current theme in applyTheme is', theme);
  let theme = 'light';   // TDZ for the console.log above
  return theme;
}

const userName = 'Ada';
const theme = 'dark';

document.getElementById('theme').textContent = theme;
document.getElementById('dark').textContent = isDark() ? 'yes' : 'no';
applyTheme();
