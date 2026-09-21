import * as voidHtmlPlugin from '@awmottaz/prettier-plugin-void-html';
import type { Config } from 'prettier';

/**
 * @see https://prettier.io/docs/configuration
 */
const config: Config = {
  plugins: [voidHtmlPlugin],
  singleQuote: true,
};

export default config;
