const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const{ protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/Cloudinary');

router.use(protect);

router.get('/me', protect, userController.getMe);
router.put('/me', protect, userController.updateMe);


router.post('/upload-avatar', upload.single('avatar'), async(req ,res ) => {
    try{
        if (!req.file) return res.status(400).json({ message: "no image uploaded" });
        
        req.user.avatar = req.file.path;
        await req.user.save();

        res.status(200).json({ message: "avatar uploaded successfully" , avatarUrl: req.file.path });
    }
    catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;