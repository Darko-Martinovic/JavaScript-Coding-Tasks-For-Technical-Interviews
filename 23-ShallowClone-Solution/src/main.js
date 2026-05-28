// =============================================================================
// SOLUTION 23 — Spread / Object.assign Shallow Copy
// =============================================================================
//
// Spread and Object.assign clone one level deep — nested arrays and
// objects are still aliased. For an editable draft, deep-clone on the
// boundary (here: `structuredClone`) and commit by ASSIGNMENT, not by
// in-place mutation.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Form draft</h1>
    <h3>Source</h3>
    <pre id="src" style="background:#eef; padding:8px"></pre>
    <h3>Draft</h3>
    <pre id="dst" style="background:#efe; padding:8px"></pre>
    <input id="newTag" placeholder="new tag" />
    <button id="add">Add to draft</button>
    <button id="save">Save</button>
    <button id="discard">Discard</button>
  </main>
`;

let profile = { name: 'Ada', tags: ['js', 'web'], prefs: { theme: 'dark' } };
// FIX #1: deep-clone when the draft is materialised so the nested
//         `tags` array and `prefs` object are independent.
let draft = structuredClone(profile);

function paint() {
  document.getElementById('src').textContent = JSON.stringify(profile, null, 2);
  document.getElementById('dst').textContent = JSON.stringify(draft, null, 2);
}

document.getElementById('add').onclick = () => {
  const v = document.getElementById('newTag').value.trim();
  if (v) draft.tags.push(v);     // safe: draft.tags is its own array now
  paint();
};

document.getElementById('save').onclick = () => {
  // FIX #2: commit by assignment. Replace `profile` with a deep clone of
  //         the draft so source and draft remain decoupled going forward.
  profile = structuredClone(draft);
  paint();
};

document.getElementById('discard').onclick = () => {
  // FIX #3: discard by reseeding the draft from a fresh deep clone of
  //         the (still-unmutated) source.
  draft = structuredClone(profile);
  paint();
};

paint();
