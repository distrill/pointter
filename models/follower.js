module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    followerId: DataTypes.STRING,
    followingId: DataTypes.STRING,
  }, {
    tableName: 'follower',
  });

  Follower.associate = (models) => {
    Follower.belongsTo(models.User, { foreignKey: 'followerId' });
    Follower.belongsTo(models.User, { foreignKey: 'followingId' });
  };

  return Follower;
};
