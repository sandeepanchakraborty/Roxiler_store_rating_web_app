
const { Rating, Store, User } = require('../models');

exports.submitRating = async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.id;

  try {
    const existing = await Rating.findOne({ where: { UserId: userId, StoreId: storeId } });
    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: 'Rating updated' });
    }

    await Rating.create({ UserId: userId, StoreId: storeId, rating });
    res.json({ message: 'Rating submitted' });
  } catch (err) {
    console.error('Error submitting rating:', err);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};
exports.getRatingsForStoreOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const stores = await Store.findAll({
      where: { userId: ownerId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    const response = stores.map(store => {
      const ratings = store.ratings || [];
      const avgRating = ratings.length
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
        : 'N/A';

      return {
        id: store.id,
        name: store.name,
        totalRatings: ratings.length,
        averageRating: avgRating,
        ratings: ratings.map(r => ({
          id: r.id,
          rating: r.rating,
          user: r.user,
        })),
      };
    });

    res.json(response);
  } catch (err) {
    console.error('Error fetching ratings for owner:', err);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};


// ratingController.js
exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const ratings = await Rating.findAll({
      where: { UserId: userId },
      include: [{ model: Store, as: 'store', attributes: ['id', 'name'] }]  // <-- add 'as' here
    });
    res.json(ratings);
  } catch (err) {
    console.error('Error fetching user ratings:', err);
    res.status(500).json({ error: 'Failed to fetch user ratings' });
  }
};


