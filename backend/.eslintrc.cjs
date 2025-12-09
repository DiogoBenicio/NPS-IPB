module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  rules: {
    'no-console': 'off',
    'node/no-unpublished-require': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
