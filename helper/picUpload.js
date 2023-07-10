const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
// ----------------------------------------- Upload image

cloudinary.config({
  cloud_name: 'dwzlmgxqp',
  api_key: '395955317297778',
  api_secret: 'x5omiP88Cvip1tWRlYvj4MJXRE4'
});

// create a multer instance and specify the destination and filename for uploaded files
const upload = multer({ dest: 'uploads/' });

const picUpload = async (req, res) => {
    try {
      await upload.single('file')(req, res);
      const { file } = req;
      // Upload the image to Cloudinary
      const filepath = path.join(__dirname, '..', '..', 'uploads', file.filename);
      const result = await cloudinary.uploader.upload(filepath);
  
      // CLOUDINARY OBJECT HERE              
      console.log('Uploaded image details:', result);
      // section needs attention D;
  
      const secureUrl = result.secure_url;
  
      // Update the profile_pic field for the user in the database
      // await User.update(
      //   { profile_pic: secureUrl },
      //   { where: { id: req.body.user_id } }
      // );
  
      // error check
      // console.log('User ID:', req.body.id);
  
      res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Image upload failed' });
    }
  };

module.exports = {picUpload}