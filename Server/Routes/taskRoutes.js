const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createTask);
router.get('/project/:projectId', getTasks);
router.put('/:id', updateTask);

module.exports = router;