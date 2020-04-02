const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    tableName: 'user',
  });

  User.associate = (models) => {
    User.hasMany(models.Follower, { foreignKey: 'followerId' });
    User.hasMany(models.Follower, { foreignKey: 'followingId' });

    function findAssociated(filterKey, selectKey) {
      return async (userId) => {
        const fs = await models.Follower.findAll({ where: { [filterKey]: userId } });
        const fids = fs.map((f) => f[selectKey]);
        return User.findAll({
          where: {
            id: { [Op.in]: fids },
          },
        });
      };
    }

    User.findFollowers = findAssociated('followingId', 'followerId');
    User.findFollowing = findAssociated('followerId', 'followingId');
  };


  return User;
};
