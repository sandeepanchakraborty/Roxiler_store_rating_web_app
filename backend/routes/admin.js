const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { Op, fn, col } = require('sequelize');
const { sequelize, User, Store, Rating } = require('../models');
const bcrypt = require('bcrypt');



router.put('/make-admin', verifyToken, requireRole('admin'), async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.json({ message: `${email} is now an admin.` });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Failed to update user role' });
  }
}); 
router.get('/stats', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const userCount = await User.count();
    const storeCount = await Store.count();
    const ratingCount = await Rating.count();

    res.json({
      users: userCount,
      stores: storeCount,
      ratings: ratingCount,
    });
  } catch (err) {
    console.error('Failed to get admin stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// routes/admin.js

router.post('/users', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'user'
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Error creating user:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});


// Add new store
router.post('/stores', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, email, address, ownerId } = req.body;

  try {
    const newStore = await Store.create({ name, email, address, userId: ownerId });
    res.status(201).json({ message: 'Store created', store: newStore });
  } catch (err) {
    console.error('Error creating store:', err);
    res.status(500).json({ error: 'Failed to create store' });
  }
});

// List users with filters (name, email, address, role)
router.get('/users', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, email, address, role } = req.query;
  let whereClause = {};

  if (name) whereClause.name = { [Op.like]: `%${name}%` };
  if (email) whereClause.email = { [Op.like]: `%${email}%` };
  if (address) whereClause.address = { [Op.like]: `%${address}%` };
  if (role) whereClause.role = role;

  try {
    const users = await User.findAll({ where: whereClause });
    // For each store owner, get their rating if needed
    res.json(users);
  } catch (err) {
    console.error('Failed to get users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// List stores with filters (name, email, address)
router.get('/stores', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, email, address } = req.query;
  let whereClause = {};

  if (name) whereClause.name = { [Op.like]: `%${name}%` };
  if (email) whereClause.email = { [Op.like]: `%${email}%` };
  if (address) whereClause.address = { [Op.like]: `%${address}%` };

  try {
         const stores = await Store.findAll({
  where: whereClause,
  include: [
    {
      model: Rating,
      as: 'ratings', // ← MATCHES Store.hasMany(Rating, { as: 'ratings' })
      attributes: [],
      required: false
    },
    {
      model: User,
      as: 'owner', // ← MATCHES Store.belongsTo(User, { as: 'owner' })
      attributes: ['id', 'name', 'email']
    }
  ],
  attributes: {
    include: [[fn('AVG', col('ratings.rating')), 'rating']] // must use alias here too!
  },
  group: ['Store.id', 'owner.id'],
  subQuery: false
});

    res.json(stores);
  } catch (err) {
    console.error('Failed to get stores:', err);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});


// Delete user by ID or email (admin only)

router.delete('/users/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    console.log('Deleting user with ID:', req.params.id);
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      console.log('Deleting ratings...');
      await Rating.destroy({ where: { UserId: user.id } });
    } catch (ratingError) {
      console.error('Failed to delete ratings:', ratingError);
    }

    try {
      console.log('Deleting stores...');
      await Store.destroy({ where: { userId: user.id } });

    } catch (storeError) {
      console.error('Failed to delete stores:', storeError);
    }

    try {
      console.log('Deleting user...');
      await user.destroy();
    } catch (userDeleteError) {
      console.error('Failed to delete user:', userDeleteError);
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});

// Delete store by ID (admin only)
router.delete('/stores/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found' });

    await Rating.destroy({ where: { StoreId: store.id } });
    await store.destroy();

    res.json({ message: 'Store deleted successfully' });
  } catch (err) {
    console.error('Error deleting store:', err);
    res.status(500).json({ error: 'Failed to delete store' });
  }
});
module.exports = router;
