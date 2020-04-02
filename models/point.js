const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Point = sequelize.define('Point', {
    userId: DataTypes.STRING,
    content: DataTypes.STRING,
  }, {
    tableName: 'point',
  });

  Point.associate = (models) => {
    Point.findAllFollowing = async (userId) => {
      const fs = await models.Follower.findAll({ where: { followerId: userId } });
      const fids = fs.map((f) => f.followingId);
      return Point.findAll({
        where: {
          userId: { [Op.in]: fids },
        },
      });
    };
  };

  return Point;
};
