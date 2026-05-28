// =============================================================================
// TASK 14 — Throw Inside a Promise Executor
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (an unhandled rejection silently swallows the bug)
//
// A small "validate then fetch" pipeline:
//   - `validate(input)`: throws synchronously if input is empty.
//   - `fetchUser(id)`: returns a Promise that resolves to a user object,
//     or rejects on a bad id.
//   - The "Submit" button validates first, then fetches, then renders.
//
// The author wrapped `validate` in `new Promise(async (resolve) => ...)`
// to make it composable. That choice silently hides errors.
//
// THINGS TO SCRUTINISE:
//   1. `new Promise(async executor)` — what happens to a Promise the
//      async executor returns? Where does an `await` rejection go?
//   2. `then(success)` with no `.catch` — where does a thrown error end up?
//   3. `throw` inside a `.then` callback that doesn't return its inner
//      Promise — is it caught by an outer `.catch`?
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - Submit with empty input: shows "validation: cannot be empty".
//   - Submit with id=999 (bad): shows "fetch error: not found".
//   - Submit with id=1: renders the user.
//
// ACTUAL (buggy) BEHAVIOR: empty input shows nothing at all (the throw
//   is swallowed). Bad id triggers an UNHANDLED rejection in the console
//   but no UI error. Only the happy path "works" — by accident.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Fetch user</h1>
    <input id="id" value="1" />
    <button id="submit">Submit</button>
    <p id="msg"></p>
    <pre id="user"></pre>
  </main>
`;

const USERS = { 1: { name: 'Ada' }, 2: { name: 'Brent' } };

function validate(input) {
  // BUG: validate is wrapped in `new Promise(async (resolve) => ...)`.
  //      The async executor returns a Promise; any throw becomes a REJECTED
  //      Promise that the outer Promise never sees. So `validate('')`
  //      resolves silently.
  return new Promise(async (resolve) => {
    if (!input) throw new Error('cannot be empty');
    resolve(input);
  });
}

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (USERS[id]) resolve(USERS[id]);
      else reject(new Error('not found'));
    }, 50);
  });
}

document.getElementById('submit').onclick = () => {
  const idInput = document.getElementById('id').value;
  const msg = document.getElementById('msg');
  const userOut = document.getElementById('user');
  msg.textContent = '';
  userOut.textContent = '';

  // BUG: `.then` chain with no `.catch`. Validation errors land in
  //      "unhandled rejection" land; fetch errors land in the console.
  validate(idInput).then((id) => {
    return fetchUser(id);
  }).then((u) => {
    userOut.textContent = JSON.stringify(u, null, 2);
  });
};
