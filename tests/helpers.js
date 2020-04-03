const Promise = require('bluebird');
const sequelize = require('../models/base');

function cleanDb() {
  return Promise.map(Object.values(sequelize.models), async (model) => {
    await model.destroy({ truncate: true, cascade: true });
  });
}

module.exports = { sequelize, cleanDb };
