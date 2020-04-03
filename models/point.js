const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const point = sequelize.define('point', {
    userId: DataTypes.STRING,
    content: DataTypes.STRING,
  }, {
    tableName: 'point',
  });

  point.associate = (models) => {
    point.belongsTo(models.user, { foreignKey: 'userId' });

    point.findAllFollowing = async (userId) => {
      const fs = await models.follower.findAll({ where: { followerId: userId } });
      const fids = fs.map((f) => f.followingId);
      return point.findAll({
        where: {
          userId: { [Op.in]: fids },
        },
        include: [{ model: models.user }],
      });
    };
  };

  return point;
};
