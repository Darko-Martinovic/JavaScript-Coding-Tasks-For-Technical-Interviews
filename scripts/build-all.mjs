// Runs `vite build` for every browser app and reports pass/fail. Node apps (just
// task 30) are skipped — they have no build step. Behavioral / static / fix-state
// all build the same; this is a sanity check that the workspace + each app's
// package.json are wired correctly.
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TASKS, folderName } from './manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fails = [];

for (const t of TASKS) {
  if (t.runner !== 'browser') continue;
  for (const kind of ['Task', 'Solution']) {
    const folder = folderName(t, kind);
    try {
      execSync('npm run build', { cwd: join(root, folder), stdio: 'pipe' });
      console.log(`ok    ${folder}`);
    } catch {
      fails.push(folder);
      console.log(`FAIL  ${folder}`);
    }
  }
}
console.log(fails.length ? `\n${fails.length} build failure(s): ${fails.join(', ')}` : '\nAll browser apps built.');
process.exit(fails.length ? 1 : 0);
