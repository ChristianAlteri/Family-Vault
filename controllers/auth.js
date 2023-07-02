// routes/auth.js
const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Import the User model

// GET /auth
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll(); // Retrieve all users from the database
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth
router.post('/', async (req, res) => {
  try {
    const newUser = req.body;
    const createdUser = await User.create(newUser); // Create a new user in the database
    res.json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /auth/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId); // Retrieve a specific user by ID
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /auth/:id
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;
    const user = await User.findByPk(userId); // Retrieve the user by ID
    if (user) {
      await user.update(updatedUser); // Update the user in the database
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /auth/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId); // Retrieve the user by ID
    if (user) {
      await user.destroy(); // Delete the user from the database
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
