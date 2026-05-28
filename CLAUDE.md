# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interview question bank: **30 self-contained vanilla-JavaScript debugging/fixing tasks** aimed at
L4/advanced developers. Each task is designed to be solved in **under 10 minutes** and deliberately
contains **multiple distinct bugs** (not a single fix). This is teaching material, not an application —
there is no shared library and each app's entry file stands alone. It mirrors the sibling React bank in
`../ReactCodingTask`.

No frameworks. Plain ES modules, DOM APIs, browser globals, and (for the one streams task only) Node
built-ins. **No TypeScript. No React. No jQuery. No UI library.**

## Structure

Each of the 30 topics ships as **two runnable apps** (60 apps total), in folders at the repo root named
`NN-Topic-Task` and `NN-Topic-Solution` (`NN` = `01`..`30`, zero-padded):

- `NN-Topic-Task` — a `// TASK NN` header comment block at the top of `src/main.js` (or `src/main.mjs`
  for the Node task): difficulty, target time, goal, "things to scrutinise" hints, EXPECTED correct
  behavior, followed by code that **runs and misbehaves**.
- `NN-Topic-Solution` — the worked fix, with **every change annotated `// FIX #n`** referencing the
  specific bug it addresses.

`README.md` indexes all 30 (number / topic / type / runner / focus). `scripts/manifest.mjs` is the
**single source of truth** for the topic list — keep both in sync when adding tasks.

## The npm workspace (one install, not 60×)

The repo root is an npm **workspace** (`"workspaces": ["*-Task", "*-Solution"]`). The only shared
dependency (Vite) is declared **once** in the **root** `package.json`. npm hoists it into a single root
`node_modules`; the per-app folders declare **no** dependencies and resolve everything by walking up
the tree. So:

- `npm install` is run **once at the repo root**. Never run install inside an app folder.
- There is exactly **one** `node_modules` (at the root), not one per app.
- Shared Vite config is centralized: every browser app's `vite.config.js` re-exports the root
  `vite.config.shared.js`.

## Build & run

Per-app workflow (the normal one). `cwd` is the app folder, so Vite's `root` is that folder:

```pwsh
cd 01-LoopVarClosure-Task && npm run dev   # observe the bug in the browser
# or, from the repo root, by workspace name:
npm run dev -w 01-LoopVarClosure-Solution  # see the corrected behavior
```

Each **browser** app's `package.json` has `dev` (vite), `build` (vite build), and `preview`. The single
**Node** app (task 30) has `start` (`node src/main.mjs`).

Root convenience scripts: `npm run build:all` iterates every browser app (`scripts/build-all.mjs`).

## Behavioral vs static tasks

- **26 behavioral** tasks: the bug is observable at runtime — a visible DOM bug, a console
  warning/error, an infinite loop, a stale closure value, a leaked listener/interval/timer, an
  unhandled rejection, or a race with visibly wrong ordering. The exercise is to *run* them and watch
  what they do wrong.
- **4 static** tasks (08, 10, 11, 22): the bug is a subtle correctness issue that wouldn't crash but
  would fail a careful code review (loose-equality coercion, accidental globals, numeric-key order
  assumption, JSON round-trip pitfalls). Their `-Task` headers include a checklist of what to look for.

## Conventions when adding or editing tasks

- Add the topic to `scripts/manifest.mjs`, then run `node scripts/scaffold.mjs` to generate the
  boilerplate. It is idempotent and **never overwrites an existing `src/main.js` / `src/main.mjs`** —
  write the real content there yourself.
- Browser apps mount into `<div id="app">` from `src/main.js` (linked from `index.html`). Node apps
  run via `node src/main.mjs`.
- Keep the bug surface on **JS pitfalls**, not build config. **ESLint is deliberately not installed** —
  any default rule (`no-undef`, `eqeqeq`, `no-unused-vars`, `no-implicit-globals`, `prefer-const`,
  `no-prototype-builtins`, …) would auto-flag a planted bug here and spoil the exercise. If you ever
  add a linter, scope it so that none of its enabled rules can detect a bug listed in
  `scripts/manifest.mjs`. `scripts/lint-all.mjs` is a no-op stub that documents this stance.
- Multiple **distinct** bugs per task — spread across the code, not clustered in one line. Each
  solution change wears a `// FIX #n` comment.
- Every Task leads with a `// TASK NN` header block: difficulty, target time, goal, hints, expected
  behavior.
