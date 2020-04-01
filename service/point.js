const { Point } = require('../models');

function fetchPoints(userId) {
  return Point.findAll({ where: { userId } });
}

function makePoint(content, userId) {
  return Point.create({ content, userId });
}

module.exports = { fetchPoints, makePoint };
