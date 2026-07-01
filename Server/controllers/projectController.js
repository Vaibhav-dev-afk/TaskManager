const project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async(req,res) => {
    try{
        const{ title, description } = req.body;
        
        const newProject = new Project({
            title,
            description,
            owner: req.user._id,
            members: [{ user: req.user._id, role: 'owner'}]
        });
        await newProject.save();
        res.status(201).json(newProject);
    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getProject = async( req, res ) => {
    try{
        const projectId = req.params.id;
        const { title, description } = req.body;
        const project = await Project.FindOneAndUpdate(
            { _id: projectId, owner: req.user._id },
            { title ,description },
            { new: true }
        );
    
        if(!project){
            return res.staus(404).json({ message: "Project not found or you are not the owner of this project" });     
        }
            res.status(200).json(Project);
    }    
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
  
    }
        
};
exports.deleteProject = async( req, res) => {
    try{
        const projectId = req.params.id;
        const Project = await Project.FindOneAndDelete(
            { _id: projectId, owner: req.user._id }
        );
        if(!project){
            res.status(404).json({ message: "Project not found or you are not the owner of this project" });
        }
        res.status(200).json({ message: "Project deleted successfully "});
    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.inviteMember = async(req, res) => {
    try{
        const projectId = req.params.id;
        const { email } = req.body;

        const project = await Project.FindOne(
            { _id: projectId ,owner: req.user._id }
        );
        if(!project){
            res.status(404).json({ message: "Project not found or you are not the owner of this project" });
        }

        const userToInvite = await User.FindOne({ email });
        if(!userToInvite){
            res.status(404).json({ message: "User with this email not found" });
        }

        const isAlreadyMember = await project.members.some( member => member.user.toString() === userToInvite._id.toString());
        if(!isAlreadyMember){
            res.status(404).json({ message: "User with this email is already the member" });
        }

        project.members.push({ user: userToInvite._Id, role: member });
        await project.save();

        res.status(200).json({ message: "Member added successfully", project });
    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};