// =============================================================================
// SOLUTION 28 — ?? vs || for 0 / "" / false
// =============================================================================
//
// `||` falls back on ANY falsy value: 0, "", false, NaN, null, undefined.
// `??` falls back ONLY on null/undefined. For "use the default if the
// user didn't specify", `??` is almost always the right operator.
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
    // FIX #1: `??` so volume=0 is honoured. Same for placeholder="" and
    //         notify=false — these are legitimate user choices, not
    //         "missing".
    volume:      opts.volume      ?? 50,
    placeholder: opts.placeholder ?? 'Type here…',
    notify:      opts.notify      ?? true,
  };
}

function setMuted(user, value) {
  // FIX #2: assign unconditionally. `||=` was the wrong operator — it
  //         only writes when LHS is falsy. The intent here is "always
  //         set muted to whatever the caller asked for".
  user.muted = value;
}

const user = { muted: true };
setMuted(user, false);

document.getElementById('out').textContent = JSON.stringify({
  defaults: applyDefaults({ volume: 0, placeholder: '', notify: false }),
  user,
}, null, 2);
