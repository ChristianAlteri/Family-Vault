
const { User, Relationship } = require('../models')

// Relation to user from new user
const createNode = async (req, res) => {
  try {
    newUser = await User.create(req.body);
    await createRelationToLoggedInUser(req, res, newUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createRelationToLoggedInUser = async (req, res, newUser) => {
  try {
    let generation;
    if (req.body.side_id === 1 || req.body.side_id === 2) {
      generation = req.body.generation - 1;
    } else if (req.body.side_id === 3 || req.body.side_id === 4) {
      generation = req.body.generation;
    } else {
      generation = req.body.generation + 1;
    }
    console.log(newUser);
    console.log('here');
    // Create the relationship record in the "relationships" table
    relationData = await Relationship.create({
      user_id: req.body.user_id,
      who_related_id: newUser.id,
      generation: generation,
      source_id: req.body.source_id,
      side_id: req.body.side_id,
    });
    
    console.log(relationData);
    res.status(200).json(relationData);
  } catch (err) {
    res.status(400).json(err);
  }
};


  module.exports = { createNode, createRelationToLoggedInUser }
  

// RElations to new user from logged in
