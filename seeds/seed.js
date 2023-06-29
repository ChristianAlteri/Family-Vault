// Import models
const { sequelize } = require('../config/connection');
const { User, Side, Relationship } = require('../models');

// Import data files
const userDataArray = require('./userData.json');
const sideDataArray = require('./sideData.json');
const relationshipDataArray = require('./relationshipData.json');

async function seedDatabase() {
  try {
    // Synchronize Sequelize with your database models
    await sequelize.sync({ force: true });
    
    // Create an empty array to hold user objects
    const users = [];

    // Create new users in the database
    for (const userData of userDataArray) {
      const newUser = await User.create(userData);
      users.push(newUser);
    }

    // Create an empty array to hold side objects
    const sides = [];

    // Create new sides in the database
    for (const sideData of sideDataArray) {
      const newSide = await Side.create(sideData);
      sides.push(newSide);
    }

    // Create relationships in the database
    for (const relationshipData of relationshipDataArray) {
      const user = users.find(user => user.id === relationshipData.user_id);
      const relatedUser = users.find(user => user.id === relationshipData.who_related_id);
      const side = sides.find(side => side.id === relationshipData.side);

      await Relationship.create({
        user_id: user.id,
        who_related_id: relatedUser.id,
        generation: relationshipData.generation,
        side_id: side.id
      });
    }

    console.log('Database seeded successfully.');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Call the seedDatabase function
seedDatabase();

