module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    'standard',
    'eslint:recommended'
  ],
  plugins: [
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'array-bracket-newline': [
      'error',
      { minItems: 1 },
    ],
    'array-element-newline': [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error',
      'only-multiline',
    ],
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
  ],
}
