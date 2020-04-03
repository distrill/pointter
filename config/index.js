const sequelize = require('./sequelize');
const auth = require('./auth');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  sequelize: { ...sequelize.base, ...sequelize[env] },
  auth: { ...auth.base, ...auth[env] },
};
