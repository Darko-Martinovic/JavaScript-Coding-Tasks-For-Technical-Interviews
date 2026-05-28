// =============================================================================
// TASK 24 — Polluting Object.prototype
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (every later object inherits a phantom property)
//
// A small CLI-config helper supports "deep merge" from user-supplied
// patches. The patch comes in as JSON (think query string or URL hash)
// and is applied to a config object. After ANY patch is applied, every
// plain object in the program suddenly seems to have an `isAdmin: true`
// property.
//
// THINGS TO SCRUTINISE:
//   1. The recursive `deepMerge` writes into the target with bracket
//      assignment. What does `target['__proto__']` REFER to?
//   2. The unrelated `cart` object is created LATER. Why does it show
//      `cart.isAdmin === true`?
//   3. A naive `for…in` over `cart` lists `isAdmin` too — the consumer
//      thinks it's a legitimate cart field.
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - Apply the malicious patch: ONLY the target `config` reflects the
//     intended `feature: { flag: true }` change.
//   - A freshly-created `cart` object has NO `isAdmin` property.
//   - for…in over `cart` lists ONLY the cart's own keys.
//
// ACTUAL (buggy) BEHAVIOR: after applying the patch, every plain object
//   in the program inherits `isAdmin = true` via Object.prototype.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Config merge</h1>
    <button id="apply">Apply user patch</button>
    <pre id="out"></pre>
  </main>
`;

const config = { feature: { flag: false } };

// BUG: deepMerge accepts ANY key — including __proto__ — and walks into
//      target['__proto__']. That's Object.prototype. Anything written
//      there is visible from every object in the program.
function deepMerge(target, patch) {
  for (const key of Object.keys(patch)) {
    const v = patch[key];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if (typeof target[key] !== 'object' || target[key] === null) target[key] = {};
      deepMerge(target[key], v);
    } else {
      target[key] = v;
    }
  }
  return target;
}

document.getElementById('apply').onclick = () => {
  // Comes in as JSON.parse(...) of attacker-controlled input. JSON.parse
  // emits a __proto__ key as an OWN property — deepMerge then walks it.
  const userPatch = JSON.parse('{"feature":{"flag":true},"__proto__":{"isAdmin":true}}');
  deepMerge(config, userPatch);
  showAll();
};

function showAll() {
  // Create a fresh unrelated object AFTER the patch. It will inherit
  // the polluted property even though we never put it there.
  const cart = { items: ['book'], total: 12 };
  const ownKeysViaForIn = [];
  // BUG (consumer): for…in walks the prototype chain. Without a
  //                 hasOwnProperty filter, isAdmin slips in.
  for (const k in cart) ownKeysViaForIn.push(k);

  document.getElementById('out').textContent = [
    `config.feature.flag : ${config.feature.flag}                (expected true — intended)`,
    `cart.isAdmin        : ${cart.isAdmin}                  (expected undefined!)`,
    `for…in over cart    : ${JSON.stringify(ownKeysViaForIn)}     (expected ["items","total"])`,
  ].join('\n');
}

showAll();
