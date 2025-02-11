import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'ignore',
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  tailwindConfig: resolve(__dirname, './tailwind.config.ts')
};

export default config;
