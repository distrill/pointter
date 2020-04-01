module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    tableName: 'user',
  });

  User.associate = (models) => {
    User.hasMany(models.Point);
  };

  return User;
};
