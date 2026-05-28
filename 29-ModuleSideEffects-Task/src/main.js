// =============================================================================
// TASK 29 — Top-Level Module Side Effects Order
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (boot order silently produces undefined config)
//
// The app boots three modules: `config.js`, `db.js`, and this `main.js`.
//
//   - `config.js` exposes a mutable `settings` object and a `configure()`
//     function. It reads `process.env`-style overrides at the TOP of the
//     module (before `configure()` could ever have been called).
//   - `db.js` imports `settings` from config and reads `settings.dsn` at
//     module evaluation to compute a connection URL. It also imports
//     a `LOG_PREFIX` from main.js — yes, circular.
//   - `main.js` imports both, calls `configure({dsn: ...})`, then asks
//     `db.connectionString()`.
//
// All this RUNS WITHOUT ERRORS, and the page renders. But the connection
// string is wrong because the value `db.js` cached at top-level is the
// value `settings.dsn` had BEFORE `configure()` ran.
//
// THINGS TO SCRUTINISE:
//   1. ES module top-level code runs once, on first import, in import
//      order. What does `db.js` see for `settings.dsn` at evaluation?
//   2. Circular imports: when `db.js` reads `LOG_PREFIX` from main at
//      its own top level, is that binding initialised yet?
//   3. The fix isn't "shuffle imports" — it's a deeper pattern. Avoid
//      reading mutable state at module evaluation. Expose getters /
//      factories instead.
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - "Connection:" shows the configured DSN ("postgres://prod"), not
//     the default.
//   - "Prefix at boot:" shows the actual LOG_PREFIX ("APP"), not
//     undefined.
//
// ACTUAL (buggy) BEHAVIOR: "Connection:" shows the DEFAULT dsn baked
//   in at boot; "Prefix at boot:" shows `undefined` because the circular
//   import hadn't finished initialising at the time db.js read it.
// =============================================================================

import { settings, configure } from './config.js';
import { connectionString, prefixSeenAtBoot } from './db.js';

export const LOG_PREFIX = 'APP';

configure({ dsn: 'postgres://prod' });

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Boot order</h1>
    <p>Connection: <strong>${connectionString()}</strong></p>
    <p>Settings now: <code>${JSON.stringify(settings)}</code></p>
    <p>Prefix at boot: <strong>${String(prefixSeenAtBoot)}</strong></p>
  </main>
`;
