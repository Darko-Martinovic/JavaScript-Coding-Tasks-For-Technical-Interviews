import { settings } from './config.js';
// FIX #2: NO circular `import { LOG_PREFIX } from './main.js'` anymore.
//         Instead, main.js explicitly hands us the prefix after its own
//         bindings are initialised. That makes the data flow one-way.

let prefix;
export function capturePrefix(p) { prefix = p; }

// FIX #3: connectionString is a FUNCTION that reads settings.dsn at CALL
//         time. The old version captured settings.dsn at module
//         evaluation and was stuck with the default forever.
export function connectionString() {
  return `${settings.dsn}?app=${prefix}`;
}
