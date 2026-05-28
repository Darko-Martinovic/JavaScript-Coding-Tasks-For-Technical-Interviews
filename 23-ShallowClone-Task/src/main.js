// =============================================================================
// TASK 23 — Spread / Object.assign Shallow Copy
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (visible: edits on the "clone" change the "original")
//
// A "form with draft" pattern: the source profile is stored separately
// from the draft the user edits. Saving should commit the draft to the
// source; Discard should reset the draft from the source. Adding a tag
// to the DRAFT should not appear in the SOURCE until Save.
//
// Both spread (`{...src}`) and `Object.assign({}, src)` make SHALLOW
// copies. Nested arrays and objects are still shared by reference.
//
// THINGS TO SCRUTINISE:
//   1. After `draft = { ...profile }`, is `draft.tags === profile.tags`?
//   2. Is the snapshot taken before any edits — or is it a reference
//      held over time?
//   3. When you save by mutating `profile`, what happens to the draft's
//      references?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Type a tag and click "Add to draft" — the source list does NOT
//     change.
//   - Click Save — the source now matches the draft.
//   - Click Discard — the draft resets to whatever the source currently
//     is, with no leftover edits.
//
// ACTUAL (buggy) BEHAVIOR: "Add to draft" also adds to the source list
//   (the tags array is shared); Discard appears to clear edits but the
//   source has already mutated; Save accidentally drops nested data.
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

const profile = { name: 'Ada', tags: ['js', 'web'], prefs: { theme: 'dark' } };
// BUG 1: spread is SHALLOW. `draft.tags === profile.tags` and
//        `draft.prefs === profile.prefs`. Any push or assign to
//        draft.tags mutates profile too.
let draft = { ...profile };

function paint() {
  document.getElementById('src').textContent = JSON.stringify(profile, null, 2);
  document.getElementById('dst').textContent = JSON.stringify(draft, null, 2);
}

document.getElementById('add').onclick = () => {
  const v = document.getElementById('newTag').value.trim();
  if (v) draft.tags.push(v);     // BUG 1 in action — also pushes to source
  paint();
};

document.getElementById('save').onclick = () => {
  // BUG 2: Object.assign(profile, draft) is also shallow. It REASSIGNS
  //        profile.tags and profile.prefs to the draft's references —
  //        which were already the same references — so nothing visibly
  //        breaks here, but any future edit to draft will continue to
  //        leak into profile.
  Object.assign(profile, draft);
  paint();
};

document.getElementById('discard').onclick = () => {
  // BUG 3: re-creating the draft from a shallow copy of the now-mutated
  //        source means the "discard" appears to roll back — until you
  //        check the source itself.
  draft = { ...profile };
  paint();
};

paint();
