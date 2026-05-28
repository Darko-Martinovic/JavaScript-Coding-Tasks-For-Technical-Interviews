// =============================================================================
// SOLUTION 30 — Streams: No end-Await, No Error Handling
// =============================================================================
//
// Three fixes:
//   (1) Resolve on 'end' (and reject on 'error') so the Promise tracks
//       the stream's lifecycle. Or — better — use `pipeline` or
//       async iteration, which do both for you.
//   (2) Use `node:stream/promises` `pipeline()`. It propagates errors
//       end-to-end AND awaits completion. `pipe()` does neither.
//   (3) Drain the async iterator fully — don't `return` from the loop
//       body unless you really mean to abort.
// =============================================================================

import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

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

// FIX #1: resolve on 'end', reject on 'error'. Total bytes are now the
//         actual count once the stream has fully drained.
function copyToBuffer(readable) {
  return new Promise((resolve, reject) => {
    let total = 0;
    readable.on('data', (chunk) => { total += chunk.length; });
    readable.on('end',  () => resolve(total));
    readable.on('error', reject);
  });
}

// FIX #2: `pipeline()` from node:stream/promises awaits completion AND
//         propagates errors from any stage. The caller can try/catch
//         normally. The injected sink failure is now visible.
async function copyWithPipe(readable) {
  await pipeline(readable, makeFailingSink());
  return 'ok';
}

// FIX #3: drain the iterator fully before returning the accumulated rows.
async function parseLines(readable) {
  const rows = [];
  for await (const chunk of readable) {
    rows.push(chunk.toString().split('\n'));
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
  console.log('(3) lines is array?', Array.isArray(lines), 'chunks:', lines.length);
})();
