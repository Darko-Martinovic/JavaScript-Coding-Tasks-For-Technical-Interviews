// =============================================================================
// SOLUTION 29 — Top-Level Module Side Effects Order
// =============================================================================
//
// The fix isn't to reshuffle imports — module load order is determined by
// the import graph, not by where you write the import statements. The
// right pattern is: defer reads of mutable state. Expose a getter or
// factory; let consumers ask for the CURRENT value when they need it,
// not the value at module-evaluation time.
//
// And for the circular import: instead of relying on a sibling's
// initialised binding at top level, defer to call time (or break the
// cycle by injecting the value).
// =============================================================================

import { settings, configure } from './config.js';
import { connectionString, capturePrefix } from './db.js';

export const LOG_PREFIX = 'APP';

configure({ dsn: 'postgres://prod' });

// FIX #1: hand the prefix to db.js explicitly AFTER main's bindings have
//         finished initialising. This breaks the "circular dependency
//         reads undefined at boot" pattern.
capturePrefix(LOG_PREFIX);

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Boot order</h1>
    <p>Connection: <strong>${connectionString()}</strong></p>
    <p>Settings now: <code>${JSON.stringify(settings)}</code></p>
    <p>Prefix at boot: <strong>${LOG_PREFIX}</strong></p>
  </main>
`;
