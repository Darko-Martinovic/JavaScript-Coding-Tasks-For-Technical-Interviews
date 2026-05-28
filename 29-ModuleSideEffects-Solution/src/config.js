// FIX #1 (config side): still initialise the default at module evaluation,
// but consumers no longer read this snapshot at THEIR module evaluation;
// they call the getter at use time (see db.js).
export const settings = { dsn: 'postgres://default' };

export function configure(patch) {
  Object.assign(settings, patch);
}
