const app = require('./app');                  // Your Express app
const { sequelize } = require('./models');     // ✅ Use this to get associations too

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established');
    return sequelize.sync({ alter: true });    // Use { force: true } if you want a full reset (careful!)
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database Connection Error:', err);
  });

