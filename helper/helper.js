
const { and } = require('sequelize');
const { User, Relationship } = require('../models')

// Relation to user from new user
const createNode = async (req, res) => {
  try {

    clickedUser = req.body.user_id
    console.log(req.body);
    newUser = await User.create(req.body);
    await createRelationToLoggedInUser(req, res, newUser, clickedUser);
  } catch (err) {
    res.status(400).json(err);
  }
};

const getCurrentGen = async (loggedInUser, clickedUser ) => {
  const data = await Relationship.findOne({
    where: {
      user_id: loggedInUser,
      who_related_id: clickedUser,
    },
  });
  return data.generation;
}
const createRelationToLoggedInUser =  async (req, res, newUser, clickedUser) => {
  try {
    const loggedInUser = req.session.userId
    let generation = await getCurrentGen(loggedInUser, clickedUser)
    if (req.body.side_id == 1 || req.body.side_id == 2) {
      generation --;
    } else if (req.body.side_id == 3 || req.body.side_id == 4) {
      generation = generation;
    } else {
      generation ++;
    }
    // Create the relationship record in the "relationships" table
    relationData = await Relationship.create({
      user_id: loggedInUser,
      who_related_id: newUser.id,
      generation: generation,
      source_id: clickedUser,
      side_id: req.body.side_id,
    });


    let linkedSide;
        if (req.body.side_from_sex === 0 && req.body.side_id === 5) {
            linkedSide = 1;
        } else if (req.body.side_from_sex === 1 && req.body.side_id === 5) {
            linkedSide = 2;
        } else if (req.body.side_id === 3) {
            linkedSide = 3;
        } else if (req.body.side_id === 4) {
            linkedSide = 4;
        } else {
            linkedSide = 5;
        } 
    
    inverseRelationship = await Relationship.create({
      user_id: newUser.id,
      who_related_id: loggedInUser,
      generation: generation,
      source_id: clickedUser,
      side_id: linkedSide,
    })
    res.redirect('/')
  } catch (err) {
    res.status(400).json(err);
  }
};


  module.exports = { createNode, createRelationToLoggedInUser }
  


