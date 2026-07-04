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

exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findOneAndDelete({ _id: projectId, owner: req.user._id });
        if (!project) {
            return res.status(404).json({ message: "Project not found or you are not the owner." });
        }
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.inviteMember = async (req, res) => {
    try {
        const { email } = req.body;
        const projectId = req.params.id;

        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });

        const userToInvite = await User.findOne({ email });
        if (!userToInvite) return res.status(404).json({ message: 'User not found' });

        const isMember = project.members.some(m => m.user.toString() === userToInvite._id.toString());
        if (isMember) return res.status(400).json({ message: 'User is already a member' });

        project.members.push({ user: userToInvite._id, role: 'member' });
        await project.save();

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};