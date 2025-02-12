import { FlatCompat } from '@eslint/eslintrc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'next/core-web-vitals',
      'next/typescript',
      'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint']
  }),
  {
    rules: {
      // Enforce using `import type` for type-only imports.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: false
        }
      ]
    }
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports come first.
            ['^\\u0000'],
            // Namespace imports (those starting with "import * as")
            ['^\\s*import\\s+\\*\\s+as'],
            // Type imports (using "import type")
            ['^\\s*import\\s+type'],
            // Packages: React first, then other packages.
            ['^react'],
            ['^radix-ui'],
            ['^lucide-react'],
            ['^@?\\w'],
            // Internal modules: Components UI and Components.
            ['^@/components/ui'],
            ['^@/components'],
            // Public assets.
            ['^@/public'],
            // Other internal modules: lib, utils, hooks, features.
            ['^@/lib'],
            ['^@/utils'],
            ['^@/hooks'],
            ['^@/features'],
            // Relative imports.
            ['^\\.', '^[./]']
          ]
        }
      ],
      'simple-import-sort/exports': 'error'
    }
  },
  {
    ignores: ['.next/']
  }
];

export default eslintConfig;
