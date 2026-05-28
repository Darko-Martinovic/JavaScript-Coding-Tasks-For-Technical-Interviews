// Re-exports the repo-root shared config so every browser app shares ONE
// config + ONE dependency set (Vite is hoisted from the workspace root).
export { default } from '../vite.config.shared.js';
