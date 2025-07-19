module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sellingPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    purchasePrice: DataTypes.FLOAT,
    minimumPrice: DataTypes.FLOAT,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    applications: DataTypes.STRING,
    category: DataTypes.STRING,
    comments: DataTypes.TEXT,
    location: DataTypes.STRING,
    sku: {
      type: DataTypes.STRING,
      unique: true
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    supplier: DataTypes.STRING,
    expiryDate: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate: (product) => {
        if (!product.sku) {
          const prefix = 'SKU-';
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 10000);
          product.sku = prefix + timestamp + '-' + random;
        }
      }
    }
  });

  Product.associate = models => {
    Product.belongsToMany(models.Product, {
      as: 'alternatives',
      through: 'ProductAlternatives',
      foreignKey: 'productId',
      otherKey: 'alternativeId'
    });
  };

  return Product;
};