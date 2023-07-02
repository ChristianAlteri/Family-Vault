const express = require('express');
const router = express.Router();
const { Relationship, User, Side } = require('../models');

// GET /relationships
router.get('/', async (req, res) => {
    try {
      const relationships = await Relationship.findAll();
      res.json(relationships);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // GET a specific relationship by ID
  router.get('/:id', async (req, res) => {
    // add implementation for fetching a specific relationship by ID
  });
  
  // POST a new relationship
  router.post('', async (req, res) => {
    // add implementation for creating a new relationship
  });
  
  // PUT/update a specific relationship by ID
  router.put('/:id', async (req, res) => {
    // add implementation for updating a specific relationship by ID
  });
  
  // DELETE a specific relationship by ID
  router.delete('/:id', async (req, res) => {
    // add implementation for deleting a specific relationship by ID
  });
  
  module.exports = router;