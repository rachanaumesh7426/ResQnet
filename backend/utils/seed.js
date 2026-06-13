const User = require('../models/User');

const seedDatabase = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@demo.com' });
    if (existingAdmin) {
      console.log(' Demo accounts already exist');
      return;
    }

    console.log(' Creating demo accounts...');

    await User.create({ name: 'Admin User', email: 'admin@demo.com', password: 'admin123', role: 'admin', phone: '9800000001' });
    await User.create({ name: 'Volunteer Demo', email: 'responder@demo.com', password: 'responder123', role: 'responder', phone: '9800000002', skills: ['medical', 'rescue', 'driving'], isAvailable: true });
    await User.create({ name: 'Citizen Demo', email: 'citizen@demo.com', password: 'citizen123', role: 'citizen', phone: '9800000003' });

    console.log('Demo accounts created!');
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

module.exports = seedDatabase;