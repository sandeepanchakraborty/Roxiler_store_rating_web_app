const { Store, Rating } = require('../models');
const { Op } = require('sequelize');

exports.createStore = async (req, res) => {
  try {
    const { name, address, email, ownerId } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: 'Name and address are required' });
    }

    const storeData = {
      name,
      address,
      email,
    };

    if (ownerId) {
      storeData.userId = Number(ownerId);
    }

    const store = await Store.create(storeData);

    res.status(201).json(store);
  } catch (err) {
    console.error('Error creating store:', err);
    res.status(500).json({ error: 'Failed to create store', details: err.message });
  }
};
// storeController.js
exports.getAllStores = async (req, res) => {
  const { name, address } = req.query;
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  const stores = await Store.findAll({
    where,
    include: [{ model: Rating, as: 'ratings' }]  // <-- add 'as' here
  });

  const data = stores.map(store => {
    const ratings = store.ratings;
    const avgRating = ratings.length ? (ratings.reduce((a, r) => a + r.rating, 0) / ratings.length).toFixed(2) : 'N/A';
    return { ...store.toJSON(), averageRating: avgRating };
  });

  res.json(data);
};

