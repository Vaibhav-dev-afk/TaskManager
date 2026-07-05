const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
    try {
        const { title, description, projectId, status, priority, dueDate } = req.body;
        const project = await Project.findOne({
            _id: projectId,
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        });

        if (!project) return res.status(403).json({ message: 'Not authorized' });

        const task = await Task.create({
            title,
            description,
            project: projectId,
            status,
            priority,
            dueDate
        });

        const io = req.app.get('io');
        io.to(projectId.toString()).emit('taskCreated', task);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findOne({
            _id: projectId,
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        });

        if (!project) return res.status(403).json({ message: 'Not authorized' });

        const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name avatar');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, status, priority, assignedTo, dueDate } = req.body;
        const task = await Task.findById(taskId);
        
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const project = await Project.findOne({
            _id: task.project,
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        });

        if (!project) return res.status(403).json({ message: 'Not authorized' });

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, status, priority, assignedTo, dueDate },
            { new: true }
        ).populate('assignedTo', 'name avatar');

        const io = req.app.get('io');
        io.to(task.project.toString()).emit('taskUpdated', updatedTask);

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const project = await Project.findOne({
            _id: task.project,
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        });

        if (!project) return res.status(403).json({ message: 'Not authorized' });

        await Task.findByIdAndDelete(taskId);

        const io = req.app.get('io');
        io.to(task.project.toString()).emit('taskDeleted', taskId);

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};