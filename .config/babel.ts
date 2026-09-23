import type { InputOptions } from '@babel/core';

const babelConfig: InputOptions = {
  presets: [
    ['@babel/preset-typescript', { rewriteImportExtensions: true }],
    '@babel/preset-env',
  ],
  minified: true,
  sourceMap: true,
};

export default babelConfig;
