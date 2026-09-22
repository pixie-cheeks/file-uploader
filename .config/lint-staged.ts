import { defineConfig } from 'lint-staged/config';

export default defineConfig({
  '*': [
    'pnpm prettier --write --ignore-unknown',
    'cspell --no-must-find-files',
  ],
  '*.{js,ts}': 'pnpm eslint',
  '*.ejs': ['ejslint'],
  '*.prisma': ['prisma validate', 'prisma format'],
});
