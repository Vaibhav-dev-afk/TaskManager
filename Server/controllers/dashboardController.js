const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboardStats = async (req, res) => {
    try {
        const userProjects = await Project.find({
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        });
        
        const projectIds = userProjects.map(p => p._id);

        const taskStats = await Task.aggregate([
            { $match: { project: { $in: projectIds } } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const overdueCount = await Task.countDocuments({
            project: { $in: projectIds },
            status: { $ne: 'done' },
            dueDate: { $lt: new Date() }
        });

        const myTasks = await Task.find({
            assignedTo: req.user._id,
            status: { $ne: 'done' }
        }).populate('project', 'title').sort({ dueDate: 1 }).limit(5);

        const formattedStats = {
            todo: 0,
            inprogress: 0,
            done: 0,
            overdue: overdueCount,
            totalProjects: userProjects.length,
            recentTasks: myTasks
        };

        taskStats.forEach(stat => {
            if (formattedStats[stat._id] !== undefined) {
                formattedStats[stat._id] = stat.count;
            }
        });

        res.status(200).json(formattedStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};