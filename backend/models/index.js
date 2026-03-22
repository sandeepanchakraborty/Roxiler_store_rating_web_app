const sequelize = require('../config/db');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Associations
User.hasMany(Rating, { foreignKey: 'UserId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'UserId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'StoreId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'StoreId', as: 'store' });

Store.belongsTo(User, { foreignKey: 'userId', as: 'owner' }); // owner of store

 
module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};

