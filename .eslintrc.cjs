module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:sonarjs/recommended-legacy',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '**/__generated__/*'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'sonarjs'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    // Global sonarjs rules
    'sonarjs/void-use': 'off', // void operator is used intentionally for fire-and-forget async calls
    'sonarjs/no-nested-conditional': 'off', // Nested ternary for loading/empty/data states is common React pattern
    'sonarjs/redundant-type-aliases': 'off', // Type aliases for domain semantics are acceptable
    'sonarjs/cognitive-complexity': 'off', // Complex domain logic in Schema entity and related utilities
    'sonarjs/todo-tag': 'off', // TODOs are tracked separately
    'sonarjs/different-types-comparison': 'off', // Negated conditions are sometimes more readable
    'sonarjs/no-inverted-boolean-check': 'off', // Negated conditions are sometimes more readable
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.ts', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'sonarjs/no-hardcoded-passwords': 'off',
        'sonarjs/no-clear-text-protocols': 'off',
        'sonarjs/no-nested-functions': 'off',
        'sonarjs/no-skipped-tests': 'off',
        'sonarjs/constructor-for-side-effects': 'off',
      },
    },
    {
      files: ['**/e2e/**/*.ts'],
      rules: {
        'sonarjs/no-hardcoded-passwords': 'off',
        'sonarjs/no-nested-functions': 'off',
        'sonarjs/pseudo-random': 'off',
        'sonarjs/no-skipped-tests': 'off',
      },
    },
    {
      files: ['vite.config.ts'],
      rules: {
        'sonarjs/no-os-command-from-path': 'off', // PATH usage in dev config is safe (build tooling only)
      },
    },
  ],
}
