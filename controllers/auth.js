const express = require('express');
const router = express.Router();
const User = require('../models/User');

//need authentication route............ 


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // find the user by email
    const user = await User.findOne({ where: { email } });

    // see if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // see if the pw is correct
    const passwordMatch = user.checkPassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }


    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//login
//signout
//s
module.exports = router;
