const OFF = 0;

module.exports = {
  root: true,
  extends: [
    'prettier',
    'prettier/react',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
  },
  rules: {
    '@typescript-eslint/no-use-before-define': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/camelcase': OFF,
  },
};
