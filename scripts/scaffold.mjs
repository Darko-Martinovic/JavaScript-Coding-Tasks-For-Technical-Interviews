// Generates the per-app boilerplate for every Task/Solution folder from the
// manifest. It is idempotent and NEVER overwrites an existing src/main.js or
// src/main.mjs (the real content).
//   Browser apps get: package.json, index.html, vite.config.js, placeholder src/main.js
//   Node apps    get: package.json,                              placeholder src/main.mjs
// Run from the repo root:  node scripts/scaffold.mjs
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TASKS, folderName } from './manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const browserPkg = (folder) => JSON.stringify({
  name: folder.toLowerCase(),
  private: true,
  version: '1.0.0',
  type: 'module',
  scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
}, null, 2) + '\n';

const nodePkg = (folder) => JSON.stringify({
  name: folder.toLowerCase(),
  private: true,
  version: '1.0.0',
  type: 'module',
  scripts: { start: 'node src/main.mjs' },
}, null, 2) + '\n';

const indexHtml = (title) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`;

const viteConfig = `// Re-exports the repo-root shared config so every browser app shares ONE
// config + ONE dependency set (Vite is hoisted from the workspace root).
export { default } from '../vite.config.shared.js';
`;

const placeholderBrowser = (title) => `// ${title}
// Placeholder — author the real Task/Solution code here.
document.getElementById('app').textContent = '${title} — src/main.js not authored yet';
`;

const placeholderNode = (title) => `// ${title}
// Placeholder — author the real Task/Solution code here.
console.log('${title} — src/main.mjs not authored yet');
`;

let made = 0;
for (const t of TASKS) {
  for (const kind of ['Task', 'Solution']) {
    const folder = folderName(t, kind);
    const dir = join(root, folder);
    const src = join(dir, 'src');
    mkdirSync(src, { recursive: true });

    const title = `${t.num} ${t.title} — ${kind}`;
    if (t.runner === 'browser') {
      writeFileSync(join(dir, 'package.json'), browserPkg(folder));
      writeFileSync(join(dir, 'index.html'), indexHtml(title));
      writeFileSync(join(dir, 'vite.config.js'), viteConfig);
      const mainPath = join(src, 'main.js');
      if (!existsSync(mainPath)) writeFileSync(mainPath, placeholderBrowser(title));
    } else {
      writeFileSync(join(dir, 'package.json'), nodePkg(folder));
      const mainPath = join(src, 'main.mjs');
      if (!existsSync(mainPath)) writeFileSync(mainPath, placeholderNode(title));
    }
    made++;
  }
}
console.log(`Scaffolded ${made} app folders (main.js / main.mjs preserved where present).`);
