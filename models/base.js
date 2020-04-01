const Sequelize = require('sequelize');
const { v4: uuid } = require('uuid');
const { sequelize: sqConfig } = require('../config');

const globalHooks = {
  beforeCreate: (model) => {
    if (!model.id) {
      // eslint-disable-next-line no-param-reassign
      model.id = uuid();
    }
  },
};

const options = { ...sqConfig, define: { hooks: globalHooks } };

module.exports = new Sequelize(
  sqConfig.database,
  sqConfig.username,
  sqConfig.password,
  options,
);
