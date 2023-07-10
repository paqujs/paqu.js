module.exports = {
    root: true,
    env: {
        node: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    plugins: ['@typescript-eslint'],
    rules: {
        'no-console': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'no-prototype-builtins': 'off',
        'no-inner-declarations': 'off',
        'no-constant-condition': 'off',
        'no-async-promise-executor': 'off',
        'no-case-declarations': 'off',
        'no-undef': 'error',
        'no-useless-escape': 'off',
        'no-empty': 'off',
        'no-irregular-whitespace': 'off',
        'no-control-regex': 'off',
        'no-useless-escape': 'off',
        'no-constant-condition': 'off',
        'no-empty-character-class': 'off',
    },
};
