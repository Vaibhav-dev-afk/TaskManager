const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboardstats = async(req ,res ) => {
    try{
        const userProjects = await Project.findOne({
            $or: [{ owner: req.user._id},{'member.user': req.user._id}]
        });

        const projectIds = userProjects.map(project => project._id);

        const taskStats = await Task.aggregate([
            { $match: { project: { $in: projectIds } } },

            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedstats = {
            todo: 0,
            inprogress: 0,
            done: 0,
            totalProjects: 0,
        };

        taskStats.forEach(stat => {
            formattedStats[stat._id] = stat.count;
        });

        res.status(200).json(formattedStats);
    }
    catch(error){
        res.status(500).json({ message: "Servor error ", error: error.message });
    }
};