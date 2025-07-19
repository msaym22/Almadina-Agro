module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'staff'),
      defaultValue: 'staff'
    }
  });

  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      const bcrypt = require('bcryptjs');
      user.password = await bcrypt.hash(user.password, 8);
    }
  });

  return User;
};