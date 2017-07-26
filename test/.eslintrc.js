module.exports = {
  'env': {
    'mocha': true,
  },
  'plugins': [
    'mocha'
  ],
  rules: {
    'func-names': 'off',
    'prefer-arrow-callback': 'off',
    'mocha/handle-done-callback': 'error',
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-global-tests': 'error',
    'mocha/no-identical-title': 'error',
    'mocha/no-mocha-arrows': 'error',
    'mocha/no-pending-tests': 'error',
    'mocha/no-return-and-callback': 'error',
    'mocha/no-sibling-hooks': 'error',
    'mocha/no-top-level-hooks': 'error'
  }
};
