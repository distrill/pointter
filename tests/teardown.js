const process = require('process');
const { sequelize } = require('./helpers');

module.exports = async () => {
  await sequelize.close();
  process.exit(0);
};
