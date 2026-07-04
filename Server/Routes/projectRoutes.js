const express = require('express');
const router = express.Router();
const { createProject, getProjects, deleteProject, inviteMember } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createProject);
router.get('/', getProjects);
router.delete('/:id', deleteProject);
router.post('/:id/invite', inviteMember);

module.exports = router;