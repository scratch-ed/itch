module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'space-before-function-paren': 'off',
    semi: 'off',
    'no-undef': 'off',
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: 'beforeExecution|afterExecution|duringExecution|^_',
        argsIgnorePattern: '^_',
      },
    ],
    'promise/param-names': 'off',
    'no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true },
    ],
  },
  plugins: ['jest'],
};
