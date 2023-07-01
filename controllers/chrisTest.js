
const router = require('express').Router();
const session = require('express-session');
const { createNode } = require("../helper/helper");
const { Relationship, User } = require('../models');

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
        // const passwordMatch = user.checkPassword(password);
        // if (!passwordMatch) {
        //     return res.status(401).json({ message: 'Invalid password' });
        // }

        // Store the user's id in the session
        req.session.userId = user.id;

        // Save the session to send the session cookie to the client
        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(200).json({ message: 'Login successful' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// post route using the createNode function
router.post('/test', createNode);

router.get('/api/user/:id', async (req, res) => {
    try {
        const userID = parseInt(req.params.id);

        const clickedUser = await User.findByPk(userID, {
            attributes: ['id', 'sex']
        });

        if (!clickedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Construct the payload object
        let payload = {
            user_id: userID,
            who_related_id: req.session.userId,
            source_id: req.session.userId,
            side_from_sex: clickedUser.sex
        };

        console.log(payload); // Log the payload for debugging purposes

        res.json(payload); // Return the payload object
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/api/user/:id/relationships', async (req, res) => {
    try {
        const userID = parseInt(req.params.id);
        const loggedInId = req.session.userId;
        const relationships = await Relationship.findAll({
            where: { user_id: userID },
            attributes: ['id', 'user_id', 'generation'],
            include: {
                model: User,
                attributes: ['id', 'sex'],
                where: { id: loggedInId },
            },
        });

        console.log(relationships);
        res.json(relationships);
        console.log(relationships);
    } catch (err) {
        console.error('Error fetching relationships:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// router.get('/api/user/:id', async (req, res) => {
//     try {
//       const userID = await parseInt(req.params.id);
//     //   const userID = req.params.id;
//     const user = await User.findByPk(userID, {
//         include: {
//             model: Relationship,
//             attributes: ['id', 'generation'],
//             where: { id: who_related_id }, 
//         },
//         attributes: ['id', 'sex'] 
//     });
//     console.log(user);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
  
//       res.json(user);
//       console.log(user);
//     } catch (err) {
//       console.error('Error fetching user:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });




module.exports = router


