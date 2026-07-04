const express = require('express');
const router = express.Router();
const { getMe, uploadAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.use(protect);
router.get('/me', getMe);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;