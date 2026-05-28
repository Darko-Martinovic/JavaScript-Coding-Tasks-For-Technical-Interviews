// =============================================================================
// TASK 28 — ?? vs || for 0 / "" / false
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (legitimate falsy values get swallowed)
//
// A settings reader applies defaults to user-supplied options. The "||"
// fallback overrides legitimate values like 0 (volume), "" (placeholder),
// or false (notifications-off). A second helper does optional chaining
// in a setter expression and silently fails to write.
//
// THINGS TO SCRUTINISE:
//   1. `value || default` — for which inputs does it use the default
//      even when the user explicitly chose the input?
//   2. `obj?.field = newValue` — optional chaining in an assignment
//      LHS is a syntax error. Where exactly is the short-circuit?
//   3. `||=` vs `??=` — when does each one assign?
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - applyDefaults({ volume: 0, placeholder: "", notify: false })
//     keeps all three user values (volume=0, placeholder="", notify=false).
//   - setMuted(user, false) sets user.muted to false (not "no change").
//
// ACTUAL (buggy) BEHAVIOR: volume becomes 50, placeholder becomes
//   "Type here…", notify becomes true; setMuted silently no-ops when
//   value is false.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Defaults</h1>
    <pre id="out" style="background:#eef; padding:8px"></pre>
  </main>
`;

function applyDefaults(opts) {
  return {
    // BUG 1: || treats 0 as falsy → default 50 wins over a legitimate 0.
    volume:      opts.volume      || 50,
    // BUG 2: || treats "" as falsy → default placeholder wins over the
    //        explicit empty string.
    placeholder: opts.placeholder || 'Type here…',
    // BUG 3: || treats false as falsy → default `true` always wins.
    notify:      opts.notify      || true,
  };
}

function setMuted(user, value) {
  // BUG 4: ||= only assigns when LHS is FALSY. The user passing `false`
  //        means "leave it alone" instead of "set to false".
  user.muted ||= value;
}

const user = { muted: true };
setMuted(user, false);

document.getElementById('out').textContent = JSON.stringify({
  defaults: applyDefaults({ volume: 0, placeholder: '', notify: false }),
  user,
}, null, 2);
