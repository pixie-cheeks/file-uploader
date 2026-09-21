import path from 'node:path';
import pixie from '@pixie-cheeks/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { files: ['**/*.{ts,js}'] },
  { ignores: ['dist', 'src/generated'] },
  ...pixie.typescript,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.resolve(import.meta.dirname, '..'),
      },
    },
    rules: {
      'import-x/extensions': ['error', 'ignorePackages'],
    },
  },
  {
    files: ['{eslint,vite,postcss}.config.{js,ts}', '.config/**/*'],
    rules: {
      'import-x/no-default-export': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
  {
    files: ['src/**/*'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      'no-console': 'off',
      'unicorn/filename-case': ['error', { cases: { camelCase: true } }],
      camelcase: 'off',
    },
  },
  {
    files: ['build-project.ts'],
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['src/public/**/*'],

    languageOptions: {
      globals: pixie.globals.browser,
    },
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  pixie.prettier,
]);
