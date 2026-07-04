const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        const project = await Project.create({
            title,
            description,
            owner: req.user._id,
            members: [{ user: req.user._id, role: 'owner' }]
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user._id },
                { 'members.user': req.user._id }
            ]
        }).populate('owner', 'name email').populate('members.user', 'name email');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};