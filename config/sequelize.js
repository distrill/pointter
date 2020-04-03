module.exports = {
  base: {
    dialect: 'postgres',
    operatorsAliases: 0,
    logging: false,
  },
  development: {
    username: 'ptr_dev',
    password: 'ptr_dev',
    database: 'ptr_dev',
    host: '127.0.0.1',
  },
  test: {
    dialect: 'postgres',
    username: 'ptr_test',
    password: 'ptr_test',
    database: 'ptr_test',
    host: '127.0.0.1',
  },
  production: {
    // fill me out for production env
  },
};
