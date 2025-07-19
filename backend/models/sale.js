module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    totalAmount: DataTypes.FLOAT,
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'credit'),
      defaultValue: 'cash'
    },
    paymentStatus: {
      type: DataTypes.ENUM('paid', 'pending', 'partial'),
      defaultValue: 'paid'
    },
    items: DataTypes.JSON,
    receiptImage: DataTypes.STRING
  });

  Sale.associate = models => {
    Sale.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });
  };

  return Sale;
};