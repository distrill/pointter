const path = require('path');

module.exports = {
  globalTeardown: path.join(__dirname, 'tests', 'teardown.js'),
};
