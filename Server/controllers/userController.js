const User = require('../models/User');

exports.getMe = async(req,res) => {
    try{
        res.status(201).json(req,res);
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
};

exports.updateMe = async(req,res) => {
    try{
        const{ name, bio ,avatar } = req.body;

        const updateUser = await User.findbyIdAndUpdate(
            req.user._id,
            { name, bio, avatar },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            message: "Profile updated succesfully",
            user: updatedUser
        });
    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message});
    }
};