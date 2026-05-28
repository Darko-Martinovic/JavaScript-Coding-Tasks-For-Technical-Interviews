// =============================================================================
// TASK 30 — Streams: No end-Await, No Error Handling   (Node-only)
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral — RUN WITH:  npm run start -w 30-NodeStreams-Task
//
// Three independent stream pipelines on a freshly-generated 200KB
// in-memory source:
//
//   (1) `copyToBuffer()` reads all bytes via the `'data'` event and
//        is supposed to resolve with the total length. It logs "done"
//        BEFORE the file is fully read, and the printed length is wrong.
//   (2) `copyWithPipe()` pipes to /dev/null-equivalent via WritableStream
//        BUT throws away the result Promise. If anything errors in the
//        pipeline, the process exits with an unhandled-rejection.
//   (3) `parseLines()` parses CSV from a stream — but doesn't await the
//        end, so the caller gets `null` back instead of the parsed rows.
//
// THINGS TO SCRUTINISE:
//   1. `'data'` events fire eagerly — but `'end'` is what marks
//      completion. Where is `'end'` listened for, and how does the
//      Promise resolve?
//   2. `.pipe(dst)` returns the destination. Errors from the source DO
//      NOT propagate to the destination by default. What does
//      `pipeline()` do that `pipe()` doesn't?
//   3. `for await (const chunk of readable)` — does it consume ALL
//      chunks before the loop exits?
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - (1) total length === source.length, "done" prints AFTER read.
//   - (2) errors propagate to the caller (we deliberately inject one)
//         and are caught with try/catch.
//   - (3) parseLines returns the full array of parsed rows.
//
// ACTUAL (buggy) BEHAVIOR: (1) "done" prints first, total=0; (2)
// process crashes with "Unhandled error" on the injected failure;
// (3) parseLines returns null.
// =============================================================================

import { Readable, Writable } from 'node:stream';

function makeSource(bytes) {
  let remaining = bytes;
  return new Readable({
    read() {
      if (remaining <= 0) { this.push(null); return; }
      const chunk = Buffer.alloc(Math.min(8 * 1024, remaining), 'A');
      remaining -= chunk.length;
      this.push(chunk);
    },
  });
}

function makeFailingSink() {
  return new Writable({
    write(chunk, enc, cb) { cb(new Error('injected sink failure')); },
  });
}

// (1) BUG: resolves before 'end' fires. The 'data' handler increments
//     total, but we resolve in the next tick of the event loop with
//     the initial 0.
function copyToBuffer(readable) {
  return new Promise((resolve) => {
    let total = 0;
    readable.on('data', (chunk) => { total += chunk.length; });
    resolve(total);            // resolves immediately — before any data
  });
}

// (2) BUG: `pipe()` without error propagation. The src error will fire
//     'error' on src, but the caller doesn't see it.
async function copyWithPipe(readable) {
  const sink = makeFailingSink();
  readable.pipe(sink);
  return 'ok';
}

// (3) BUG: returns inside the loop body rather than after exhaustion.
async function parseLines(readable) {
  const rows = [];
  for await (const chunk of readable) {
    rows.push(chunk.toString().split('\n'));
    return null;        // early-returns on the first chunk!
  }
  return rows;
}

(async () => {
  const total = await copyToBuffer(makeSource(200_000));
  console.log('(1) total bytes:', total, '(expected 200000)');

  try {
    const r = await copyWithPipe(makeSource(200_000));
    console.log('(2) result:', r);
  } catch (err) {
    console.log('(2) caught:', err.message);
  }

  const lines = await parseLines(makeSource(200_000));
  console.log('(3) lines is array?', Array.isArray(lines));
})();
