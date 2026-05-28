// Intentional no-op. ESLint is deliberately NOT installed in this repo: any of
// the usual default rules (no-undef, eqeqeq, no-unused-vars, no-implicit-globals,
// prefer-const, no-prototype-builtins, …) would auto-flag a planted bug in one of
// these tasks and spoil the exercise. If you ever add a linter, scope it so that
// none of its enabled rules can detect a bug listed in scripts/manifest.mjs.
console.log('lint:all — ESLint intentionally not installed. See scripts/lint-all.mjs.');
