const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rating = sequelize.define('Rating', {
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  StoreId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Rating;

