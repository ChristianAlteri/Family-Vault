// Import models
const { sequelize }  = require('../config/connection');
const User = require('../models/User');

// Import data files
const userDataArray = require('./userData.json');


async function seedDatabase() {
  // Synchronize Sequelize with your database models
  await sequelize.sync({ force: true });
  // Create an empty array to hold user objects
  const users = [];
  // Create new users in the database
  for (const userData of userDataArray) {
    const newUser = await User.create(userData);
    users.push(newUser);
  }
  
}

// Call the seedDatabase function
seedDatabase();
