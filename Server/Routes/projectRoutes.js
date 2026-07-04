const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createProject);
router.get('/', getProjects);

module.exports = router;