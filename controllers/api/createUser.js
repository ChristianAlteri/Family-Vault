const router = require('express').Router();
const session = require('express-session');
const { Op, sequelize } = require('sequelize');
const { createNode } = require('../../helper/helper');
const { Relationship, User, Side } = require('../../models');
const path = require('path');

const fileupload = require('express-fileupload');
const multer = require('multer');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dwzlmgxqp',
  api_key: '395955317297778',
  api_secret: 'x5omiP88Cvip1tWRlYvj4MJXRE4'
});

// ----------------------------------------- Create user

// post route using the createNode function
router.post('/test', createNode);

// ----------------------------------------- Get user data by id

router.get('/api/user/:id', async (req, res) => {
  try {
    const userID = parseInt(req.params.id);

    const clickedUser = await User.findByPk(userID, {
      attributes: ['id', 'sex'],
    });

    if (!clickedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct the payload object
    let payload = {
      user_id: userID,
      who_related_id: req.session.userId,
      source_id: req.session.userId,
      side_from_sex: clickedUser.sex,
    };
    res.render('home', { payload });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------------------- Upload image


// create a multer instance and specify the destination and filename for uploaded files
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { file } = req.file;
    console.log('this is the req', req.file);
    const filename = this.toString(req.file.fieldname)
    // Upload the image to Cloudinary
    const filepath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
    console.log(filepath);
    const result = await cloudinary.uploader.upload(filepath);
    console.log('Uploaded image details:', result);

    const imgUrl = result.url;



    // TODO: pass in user id 
    // TODO: update
    User.update({
      profile_pic: imgUrl
    }, {
      where: {id: req.body.user_id}
    })

    // Perform error check if necessary

    res.status(200).json({ success: true, message: 'Image has been uploaded' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});


// 
//router.post('/upload', async (req, res) => {
//  try {
//    const { file } = req.body;
//    //const { file } = '../../randall.jpg';
//
//    // upload the image to Cloudinary
//    const result = await cloudinary.uploader.upload(file);
//    console.log('this tha body', file);
//
//   // error check
//
//    res.status(200).json({ success: true, message: 'image has been uploaded' });
//  } catch (error) {
//    console.error('Error uploading image:', error.message);
//    res.status(500).json({ success: false, message: 'error uploading image' });
//  }
//
//});


module.exports = router;