module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      // Disable ESLint rules conflicting with Prettier
      'prettier',
      // Detect common patterns that can lead to security issues
      'plugin:security/recommended',
      'plugin:security-node/recommended',
    ],
    env: {
      node: true,
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn'
    }
};