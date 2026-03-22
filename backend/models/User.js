const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: { len: [2, 60] }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(400),
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'owner'),
    defaultValue: 'user'
  }
});

module.exports = User;
