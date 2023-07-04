
const { and } = require('sequelize');
const { User, Relationship } = require('../models')

// Relation to user from new user
const createNode = async (req, res) => {
  try {
    clickedUser = req.params.id
    console.log(req.body);
    newUser = await User.create(req.body);
    await createRelationToLoggedInUser(req, res, newUser, clickedUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createRelationToLoggedInUser =  async (req, res, newUser, clickedUser) => {
  // console.log(newUser);
  try {
    let generation
    if (req.body.side_id == 1 || req.body.side_id == 2) {
      generation = - 1;
    } else if (req.body.side_id == 3 || req.body.side_id == 4) {
      generation = 0;
    } else {
      generation = 1;
    }

    // Create the relationship record in the "relationships" table
    relationData = await Relationship.create({
      user_id: req.body.user_id,
      who_related_id: newUser.id,
      generation: generation,
      source_id: req.body.source_id,
      side_id: req.body.side_id,
    });

    // console.log(relationData);

    await linkNode(req, res, newUser, relationData, generation, clickedUser)
    
  } catch (err) {
    res.status(400).json(err);
  }
};

const linkNode = async (req, res, newUser, relationData, generation, clickedUser) => {
  try {
    let linkedSide;
// console.log('here');
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
      generation: generation +2,
      // source_id: clickedUser, // source_id is not correct  get the source id from the form
      source_id: req.body.source_id,
      side_id: linkedSide
    });
    res.redirect('/') 
    
  } catch (error) {
    res.status(400).json(err);
  }
};
  module.exports = { createNode, createRelationToLoggedInUser, linkNode }
  


