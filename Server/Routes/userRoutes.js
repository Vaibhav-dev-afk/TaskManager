const express = require('express');
const router = express.Router();
const { getMe, uploadAvatar, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.use(protect);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;