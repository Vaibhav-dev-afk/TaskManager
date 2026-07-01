
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require the user to be logged in
router.use(protect);

// Routes
router.post('/', taskController.createTask);
router.get('/project/:projectId', taskController.getTasksByProject); // e.g., /api/tasks/project/12345
router.put('/:id', taskController.updateTask); // e.g., /api/tasks/9999
router.delete('/:id', taskController.deleteTask);

module.exports = router;