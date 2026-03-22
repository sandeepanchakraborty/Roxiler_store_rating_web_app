const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('Store', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
  address: { type: DataTypes.STRING(400), allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: true }
});

module.exports = Store;
