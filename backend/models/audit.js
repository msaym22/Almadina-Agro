module.exports = (sequelize, DataTypes) => {
  const Audit = sequelize.define('Audit', {
    tableName: DataTypes.STRING,
    recordId: DataTypes.INTEGER,
    action: DataTypes.ENUM('create', 'update', 'delete'),
    changes: DataTypes.JSON,
    userId: DataTypes.INTEGER
  });

  Audit.associate = models => {
    Audit.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Audit;
};