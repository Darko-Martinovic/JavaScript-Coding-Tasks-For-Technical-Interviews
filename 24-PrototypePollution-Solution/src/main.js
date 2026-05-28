// =============================================================================
// SOLUTION 24 — Polluting Object.prototype
// =============================================================================
//
// Two layers of defense: (1) refuse dangerous keys (`__proto__`,
// `constructor`, `prototype`) in any recursive merge that walks user input;
// (2) when iterating objects with for…in, gate on `hasOwnProperty` so the
// consumer can't accidentally pick up a polluted prototype property. The
// belt-and-braces version uses `Object.create(null)` for "dictionary" maps
// so they have NO prototype at all.
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

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function deepMerge(target, patch) {
  for (const key of Object.keys(patch)) {
    // FIX #1: refuse keys that would let an attacker reach the prototype
    //         chain. This is the root cause — even one such write
    //         pollutes every object in the program.
    if (FORBIDDEN_KEYS.has(key)) continue;
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
  const userPatch = JSON.parse('{"feature":{"flag":true},"__proto__":{"isAdmin":true}}');
  deepMerge(config, userPatch);
  showAll();
};

function showAll() {
  const cart = { items: ['book'], total: 12 };
  const ownKeysViaForIn = [];
  for (const k in cart) {
    // FIX #2: hasOwnProperty filter when walking with for…in keeps
    //         consumers honest even if SOME OTHER code pollutes the
    //         prototype. Defense in depth.
    if (Object.prototype.hasOwnProperty.call(cart, k)) {
      ownKeysViaForIn.push(k);
    }
  }

  document.getElementById('out').textContent = [
    `config.feature.flag : ${config.feature.flag}                (expected true — intended)`,
    `cart.isAdmin        : ${cart.isAdmin}             (expected undefined)`,
    `for…in over cart    : ${JSON.stringify(ownKeysViaForIn)}      (expected ["items","total"])`,
  ].join('\n');
}

showAll();
