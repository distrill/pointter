const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('./base');

const basename = path.basename(__filename);
const db = {};

fs
  .readdirSync(__dirname)
  .filter((file) => (
    (file.indexOf('.') !== 0)
    && (file !== basename) && (file.slice(-3) === '.js')
    && (file !== 'base.js')
  ))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
