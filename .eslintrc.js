module.exports = {
  'plugins': ['lodash'],
  'extends': ['airbnb', 'plugin:lodash/canonical'],
  'env': {
    'node': true,
  },
  'rules': {
    'lodash/chaining': 'off'
  }
};
