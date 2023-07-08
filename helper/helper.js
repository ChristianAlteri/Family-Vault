
const { and } = require('sequelize');
const { User, Relationship } = require('../models')
const { response } = require('express');
const { Configuration, OpenAIApi } = require('openai');

// Relation to user from new user
const createNode = async (req, res) => {
  try {
    dateOfBirth = req.body.date_of_birth
    clickedUser = req.body.user_id
    const context = await getContext(dateOfBirth, res);
    const newUser = await User.create({ ...req.body, context });
    await createRelationToLoggedInUser(req, res, newUser, clickedUser);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
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

async function getContext(dateOfBirth) {
  const configuration = new Configuration({
    apiKey: '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',
  });
  const openai = new OpenAIApi(configuration);
  if (!configuration.apiKey) {
    throw new Error('OpenAI API key not configured, please follow instructions in README.md');
  }

  try {
    const prompt = await generatePrompt(dateOfBirth);
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 1.0,
      max_tokens: 3000,
    });
    return completion.data.choices[0].text;
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      throw error.response.data;
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      throw new Error('An error occurred during your request.');
    }
  }
}



  
async function generatePrompt(dateOfBirth) {
  return `Can you give me an overview of this date, ${dateOfBirth}. Please include information about significant events, cultural shifts, and social changes that characterized the decade. Keep it to four sentences`;
}


module.exports = { createNode, createRelationToLoggedInUser, getContext }
  


