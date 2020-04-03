const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    tableName: 'user',
  });

  user.associate = (models) => {
    user.hasMany(models.follower, { foreignKey: 'followerId' });
    user.hasMany(models.follower, { foreignKey: 'followingId' });
    user.hasMany(models.point, { foreignKey: 'userId' });

    function findAssociated(filterKey, selectKey) {
      return async (userId) => {
        const associates = await models.follower.findAll({ where: { [filterKey]: userId } });
        const associateIds = associates.map((a) => a[selectKey]);
        return user.findAll({
          where: {
            id: { [Op.in]: associateIds },
          },
        });
      };
    }

    user.findFollowers = findAssociated('followingId', 'followerId');
    user.findFollowing = findAssociated('followerId', 'followingId');
  };


  return user;
};
