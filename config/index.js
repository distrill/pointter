const sequelize = require('./sequelize');
const auth = require('./auth');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  sequelize: sequelize[env],
  auth: auth[env],
};
