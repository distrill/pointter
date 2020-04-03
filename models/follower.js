module.exports = (sequelize, DataTypes) => {
  const follower = sequelize.define('follower', {
    followerId: DataTypes.STRING,
    followingId: DataTypes.STRING,
  }, {
    tableName: 'follower',
  });

  follower.associate = (models) => {
    follower.belongsTo(models.user, { foreignKey: 'followerId' });
    follower.belongsTo(models.user, { foreignKey: 'followingId' });
  };

  return follower;
};
