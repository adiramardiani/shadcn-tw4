const config = {
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'ignore',
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',

    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',

    '^@/public/(.*)$',

    '^@/lib/(.*)$',
    '^@/utils/(.*)$',
    '^@/hooks/(.*)$',
    '^@/features/(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSideEffects: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderGroupNamespaceSpecifiers: true
};

export default config;
