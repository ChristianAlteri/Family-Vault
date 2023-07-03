
const { and } = require('sequelize');
const { User, Relationship } = require('../models')

// Relation to user from new user
const createNode = async (req, res) => {
  try {
    console.log(req.body);
    newUser = await User.create(req.body);
    await createRelationToLoggedInUser(req, res, newUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createRelationToLoggedInUser = async (req, res, newUser) => {
  try {
    let generation

    if (req.body.side_id === 1 || req.body.side_id === 2) {
      generation = req.body.generation - 1;
    } else if (req.body.side_id === 3 || req.body.side_id === 4) {
      generation = req.body.generation;
    } else {
      generation = req.body.generation + 1;
    }
    // console.log(newUser);

    // Create the relationship record in the "relationships" table
    relationData = await Relationship.create({
      user_id: req.body.user_id,
      who_related_id: newUser.id,
      generation: generation,
      source_id: req.body.source_id,
      side_id: req.body.side_id,
    });

    // console.log(relationData);

    await linkNode(req, res, newUser, relationData, generation)
    
  } catch (err) {
    res.status(400).json(err);
  }
};

const linkNode = async (req, res, newUser, relationData, generation) => {
  try {
    let linkedSide;
console.log('here');
    if (req.body.side_from_sex === 0 && req.body.side_id === 5) {
        linkedSide = 2;
    } else if (req.body.side_from_sex === 1 && req.body.side_id === 5) {
        linkedSide = 1;
    } else if (req.body.side_id === 3) {
        linkedSide = 3;
    } else if (req.body.side_id === 4) {
        linkedSide = 4;
    } else {
        linkedSide = 5;
    } 
    
    linkedRelationData = await Relationship.create({
      user_id: newUser.id,
      who_related_id: req.body.user_id,
      generation: generation - 2,
      source_id: req.body.user_id,
      side_id: linkedSide
    });
    // console.log(linkedRelationData);
    res.render()
  } catch (error) {
    res.status(400).json(err);
  }
};






  module.exports = { createNode, createRelationToLoggedInUser, linkNode }
  

// RElations to new user from logged in
