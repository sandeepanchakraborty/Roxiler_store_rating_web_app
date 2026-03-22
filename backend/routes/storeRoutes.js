const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, requireRole('admin'), storeController.createStore);
router.get('/', verifyToken, storeController.getAllStores);

module.exports = router;
