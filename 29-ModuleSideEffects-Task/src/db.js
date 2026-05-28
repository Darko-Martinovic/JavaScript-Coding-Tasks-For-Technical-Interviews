import { settings } from './config.js';
import { LOG_PREFIX } from './main.js';   // circular!

// BUG 1: reads settings.dsn at module evaluation — well before any caller
//        could have called configure(). The captured value is stale forever.
const dsnAtBoot = settings.dsn;

// BUG 2: reads LOG_PREFIX during evaluation of db.js. main.js is still
//        running (it imported db.js mid-way), so LOG_PREFIX is in the
//        Temporal Dead Zone equivalent for module bindings — it reads
//        as `undefined`.
export const prefixSeenAtBoot = LOG_PREFIX;

export function connectionString() {
  return `${dsnAtBoot}?app=${prefixSeenAtBoot}`;
}
