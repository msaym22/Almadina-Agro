const { sequelize } = require('./models');
const { User } = require('./models');

const initializeDatabase = async () => {
  try {
    // Create default admin user
    const adminUser = await User.findOne({ where: { username: 'naveed' } });

    if (!adminUser) {
      await User.create({
        username: 'naveed',
        password: 'Saimsaim1',
        role: 'admin'
      });
      console.log('Default admin user created');
    }

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization failed:', err);
  } finally {
    await sequelize.close();
  }
};

initializeDatabase();