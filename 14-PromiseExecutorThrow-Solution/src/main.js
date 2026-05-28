// =============================================================================
// SOLUTION 14 — Throw Inside a Promise Executor
// =============================================================================
//
// Two related fixes: (1) never make the Promise executor `async` — its
// return value is discarded, including the rejection from a thrown await;
// (2) terminate every Promise chain with a `.catch`. The cleanest end state
// here is to use `async/await` and `try/catch` directly.
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

// FIX #1: `validate` is just synchronous logic; throwing is fine. If we
//         need a Promise interface, `Promise.resolve` / `Promise.reject`
//         (or `async function`) keeps the rejection routed properly.
function validate(input) {
  if (!input) throw new Error('cannot be empty');
  return input;
}

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (USERS[id]) resolve(USERS[id]);
      else reject(new Error('not found'));
    }, 50);
  });
}

document.getElementById('submit').onclick = async () => {
  const idInput = document.getElementById('id').value;
  const msg = document.getElementById('msg');
  const userOut = document.getElementById('user');
  msg.textContent = '';
  userOut.textContent = '';

  // FIX #2: async/await with try/catch. Two separate try blocks (or one
  //         with branching) so the UI message can distinguish where the
  //         error came from. Crucially, NO promise chain dangles without
  //         a handler.
  let id;
  try {
    id = validate(idInput);
  } catch (err) {
    msg.textContent = `validation: ${err.message}`;
    return;
  }
  try {
    const u = await fetchUser(id);
    userOut.textContent = JSON.stringify(u, null, 2);
  } catch (err) {
    msg.textContent = `fetch error: ${err.message}`;
  }
};
