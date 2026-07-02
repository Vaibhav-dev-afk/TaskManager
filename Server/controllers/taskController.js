
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
    try {
        const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

        const project = await Project.findOne({
            _id: projectId,
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        });

        if (!project) {
            return res.status(403).json({ message: "Not authorized to add tasks to this project" });
        }

        const task = new Task({
            title,
            description,
            project: projectId, 
            assignedTo,        
            priority,
            duedate: dueDate
        });

        await task.save();

        const io = req.app.get('io');
        io?.to(projectId).emit('taskCreated', task);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getTasksByProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const project = await Project.findOne({
            _id: projectId,
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        });

        if (!project) {
            return res.status(403).json({ message: "Not authorized to view these tasks" });
        }

        const tasks = await Task.find({ project: projectId })
            .populate('assignedTo', 'name avatar'); 

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, status, priority, assignedTo, dueDate } = req.body;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const project = await Project.findOne({
            _id: task.project,
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        });

        if (!project) return res.status(403).json({ message: "Not authorized to edit this task" });

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, status, priority, assignedTo, dueDate },
            { new: true } 
        ).populate('assignedTo', 'name avatar');

        const io = req.app.get('io');

        io?.to(task.project.toString()).emit('taskUpdated', updatedTask);

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const project = await Project.findOne({
            _id: task.project,
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        });

        if (!project) return res.status(403).json({ message: "Not authorized to delete this task" });

        await Task.findByIdAndDelete(taskId);

        const io = req.app.get('io');
        io?.to(task.project.toString()).emit('taskDeleted', { taskId, projectId: task.project.toString() });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};