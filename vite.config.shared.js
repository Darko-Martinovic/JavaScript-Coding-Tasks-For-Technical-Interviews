// Shared Vite config used by every browser Task/Solution app.
// Each browser app's own vite.config.js simply re-exports this, so there is ONE
// place that wires up the dev server and ONE set of dependencies at the repo root.
import { defineConfig } from 'vite';

export default defineConfig({
  // `root` defaults to the cwd, i.e. the individual app folder you run from.
  server: { open: true },
});
