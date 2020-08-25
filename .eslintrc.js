module.exports = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', 'import', 'jest'],
  env: {
    node: true,
    'jest/globals': true,
  },
  rules: {
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'prettier/prettier': 'error',
  },
};
