const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
    try {
        const { title, description } = req.body;

        const newProject = new Project({
            title,
            description,
            owner: req.user._id,
            members: [{ user: req.user._id, role: 'owner' }]
        });

        await newProject.save();
        return res.status(201).json(newProject);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
        }).sort({ createdAt: -1 });

        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { title, description } = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: projectId, owner: req.user._id },
            { title, description },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found or you are not the owner of this project' });
        }

        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findOneAndDelete({
            _id: projectId,
            owner: req.user._id
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or you are not the owner of this project' });
        }

        return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.inviteMember = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { email } = req.body;

        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found or you are not the owner of this project' });
        }

        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({ message: 'User with this email not found' });
        }

        const isAlreadyMember = project.members.some(
            (member) => member.user && member.user.toString() === userToInvite._id.toString()
        );
        if (isAlreadyMember) {
            return res.status(400).json({ message: 'User with this email is already a member' });
        }

        project.members.push({ user: userToInvite._id, role: 'member' });
        await project.save();

        return res.status(200).json({ message: 'Member added successfully', project });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};