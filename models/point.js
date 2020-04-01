module.exports = (sequelize, DataTypes) => {
  const Point = sequelize.define('Point', {
    userId: DataTypes.STRING,
    content: DataTypes.STRING,
  }, {
    tableName: 'point',
  });

  Point.associate = (models) => {
    Point.belongsTo(models.User);
  };

  return Point;
};
