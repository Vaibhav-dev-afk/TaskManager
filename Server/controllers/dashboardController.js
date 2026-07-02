const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboardstats = async(req ,res ) => {
    try{
        const userProjects = await Project.find({
            $or: [{ owner: req.user._id},{'members.user': req.user._id}]
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
            'to-do': 0,
            inprogress: 0,
            completed: 0,
            totalProjects: userProjects.length,
        };

        taskStats.forEach(stat => {
            formattedstats[stat._id] = stat.count;
        });

        res.status(200).json(formattedstats);
    }
    catch(error){
        res.status(500).json({ message: "Servor error ", error: error.message });
    }
};