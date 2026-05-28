# JavaScript Coding Tasks (L4 / advanced)

30 self-contained vanilla-JavaScript debugging/fixing tasks for advanced (L4)
developers. Each task is designed to be solved in **under 10 minutes** and
deliberately contains **multiple distinct bugs** (not a single fix).

No frameworks. Plain ES modules, DOM APIs, browser globals, and (for the streams
task only) Node built-ins. No TypeScript. No React. No jQuery. Mirrors the
sibling [React bank](../ReactCodingTask).

Each topic ships as **two runnable apps** (60 apps total):

- `NN-Topic-Task` — leads with a `// TASK NN` header in `src/main.js` (or
  `src/main.mjs` for the Node task): difficulty, target time, the goal, a
  "things to scrutinise" hint list, and the EXPECTED correct behavior, followed
  by code that **misbehaves**.
- `NN-Topic-Solution` — the worked fix, with **every change annotated `// FIX #n`**
  referencing the specific bug.

Stack: **Vite** for the 29 browser tasks, **plain Node** (`node src/main.mjs`)
for task 30. Wired as an **npm workspace** so there is **one install** at the
repo root (no `node_modules` duplicated 60×).

## Running

From the repo root, install **once**:

```pwsh
npm install
```

Then run any single app — either from inside its folder, or by workspace name:

```pwsh
cd 01-LoopVarClosure-Task
npm run dev            # opens the app in your browser (Vite dev server)

# …or, from the repo root:
npm run dev -w 01-LoopVarClosure-Task
```

The Node-only task:

```pwsh
npm run start -w 30-NodeStreams-Task
```

Open the dev tools console — several tasks surface their bug as a console
warning, error, leaked listener count, or unhandled rejection, not just a
visible DOM glitch.

### Behavioral vs static tasks

- **26 behavioral** tasks: the bug is observable at runtime — wrong DOM output,
  a console error, an infinite loop, a leaked listener/interval, a stale closure
  value, an unhandled rejection, or a race with visibly wrong ordering.
- **4 static** tasks (08, 10, 11, 22): the bug is a subtle correctness issue
  that won't crash but would fail a careful code review. Their `-Task` header
  block includes a checklist of what to look for.

### Checking everything builds (optional)

```pwsh
npm run build:all     # vite build for every browser app
```

## Task index

| #  | Topic | Type | Runner | Focus |
|----|-------|------|--------|-------|
| 01 | Stale Closure in setTimeout Loop | behavioral | browser | Classic for/var loop binding each setTimeout to the same shared `i`; plus a never-cleared interval and a leaked event listener. |
| 02 | Lost `this` When Passing a Method | behavioral | browser | A method passed as a callback loses `this`; a class field forgotten as an arrow; and `.bind` called every render-equivalent. |
| 03 | Arrow Where Dynamic `this` Was Needed | behavioral | browser | Arrow function used as a DOM event handler where `this` must be the element; plus a prototype method written as arrow. |
| 04 | Mutating a Shared Object Argument | behavioral | browser | Helper mutates an object it received; default-param object is shared across calls; nested object aliased in two state slots. |
| 05 | Array .sort() Without a Comparator | behavioral | browser | Sorting numbers lexicographically; `.sort()` mutating the original; tied secondary key not handled. |
| 06 | for…in Over an Array | behavioral | browser | for…in over an array picks up inherited keys and stringifies indices; off-by-one comparison; sparse hole skipped. |
| 07 | Floating-Point Equality | behavioral | browser | `0.1 + 0.2 === 0.3` is false; toFixed used for comparison; cents stored as floats accumulate error. |
| 08 | == Coercion Traps | **static** | browser | `==` against null/undefined/0/"" branches the wrong way; `[] == ![]` truthy; in-list check uses `==` on objects. |
| 09 | let/const Hoisting & TDZ | behavioral | browser | Function reads a let/const before its declaration via an early-call reference; var/let shadow at block scope. |
| 10 | Accidental Global from a Missing const | **static** | browser | Missing `const` in a function leaks to `window`; counter shared across instances; for-loop index assigned without keyword. |
| 11 | Object.keys Order with Numeric Strings | **static** | browser | Numeric-string keys sort ascending before insertion-order strings; assumed insertion order breaks pagination. |
| 12 | Splice Inside forEach | behavioral | browser | Removing items via splice during forEach skips elements; length cached in a for-loop; index off-by-one after delete. |
| 13 | await Inside forEach | behavioral | browser | forEach ignores the returned Promise so the "done" toast fires before work finishes; results pushed in arrival order. |
| 14 | Throw Inside a Promise Executor | behavioral | browser | async function passed as the Promise executor swallows its rejection; thrown error inside .then() not chained. |
| 15 | Fire-and-Forget .then() Chain | behavioral | browser | Top-level promise without .catch leaks an unhandled rejection; await inside a non-async function silently returns Promise. |
| 16 | Race Condition: Latest-Typed-Wins | behavioral | browser | Two fetches resolve out of order so the stale one paints last; no AbortController; loading flag cleared by wrong response. |
| 17 | Debounce Whose Timer Never Clears | behavioral | browser | setTimeout id never cleared so every keystroke fires; trailing call uses stale args; `this` lost inside the timer. |
| 18 | Throttle That Drops the Last Call | behavioral | browser | Leading-edge throttle without a trailing call drops the final value; time math uses Date.now diff without saving last call. |
| 19 | Listener Registered Every Mount | behavioral | browser | A "render" routine adds a window listener every time it runs and never removes; click handler count climbs. |
| 20 | removeEventListener With a New Fn Ref | behavioral | browser | .bind / arrow wrapper creates a new function each call so removeEventListener never matches; listener stays bound. |
| 21 | Interval Closure Holds a Large Object | behavioral | browser | setInterval callback closes over a big payload that should have been GC-eligible; cleared id reset to null too early. |
| 22 | JSON Round-Trip Drops undefined/Date/Fn | **static** | browser | `JSON.parse(JSON.stringify(x))` silently drops undefined, functions, and turns Date into ISO string; Map/Set become `{}`. |
| 23 | Spread / Object.assign Shallow Copy | behavioral | browser | Spread clones top-level only; nested array shared and mutated; "clone" diverges from source then snaps back. |
| 24 | Polluting Object.prototype | behavioral | browser | A helper writes to `Object.prototype` so every later for…in picks the polluted key; hasOwnProperty filter missing. |
| 25 | isNaN vs Number.isNaN | behavioral | browser | Global `isNaN` coerces `"abc"` to NaN making it pass a "is number" check; parsed input never validated as finite. |
| 26 | parseInt Without a Radix | behavioral | browser | `parseInt` on `"08"`/`"0x10"` gives surprising results; user input parsed without trimming and with no NaN guard. |
| 27 | Global-Flag Regex Retains lastIndex | behavioral | browser | A `/g` regex `.test()`ed in a loop alternates true/false; `replaceAll` regex flagless; named groups misspelled. |
| 28 | ?? vs `\|\|` for 0 / "" / false | behavioral | browser | `\|\|` swallows `0` / `""` / `false` as falsy defaults; optional chaining short-circuits a setter; `??=` mixed with `\|\|`. |
| 29 | Top-Level Module Side Effects Order | behavioral | browser | Module-level work runs on import in the wrong order; circular import gives `undefined`; config read before `.set` call. |
| 30 | Streams: No end-Await, No Error Handling | behavioral | **Node** | `pipe()` without error propagation; not awaiting pipeline finish so the file is read short; `readable.on('data')` never resumes. |

## Conventions when adding or editing tasks

- The 30 topics live in `scripts/manifest.mjs` (the single source of truth). Add
  an entry there, then run `node scripts/scaffold.mjs` to generate the
  boilerplate — it never overwrites an existing `src/main.js` / `src/main.mjs`.
- Each app is **standalone**: no shared library, each `src/main.js` stands on
  its own.
- Behavioral tasks must **misbehave deterministically** — verify by running.
- Solutions annotate every change with `// FIX #n`; tasks lead with the
  `// TASK NN` header block.
- Keep the bug surface on **JS pitfalls**, not build config. **ESLint is
  deliberately not installed** — any default rule (`no-undef`, `eqeqeq`,
  `no-unused-vars`, `no-implicit-globals`, `prefer-const`, …) would auto-flag a
  planted bug here and spoil the exercise.
