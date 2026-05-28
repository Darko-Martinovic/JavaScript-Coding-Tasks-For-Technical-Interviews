// BUG: top-level write seeds settings.dsn at module evaluation, BEFORE
//      main.js gets a chance to call configure(). Any later mutation
//      (via configure) flips settings.dsn — but anything that has
//      ALREADY READ settings.dsn at its own top level still has the
//      original.
export const settings = {};
settings.dsn = 'postgres://default';

export function configure(patch) {
  Object.assign(settings, patch);
}
