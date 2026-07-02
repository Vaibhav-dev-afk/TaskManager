
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req,res) => {
    try{
        const { name,email,password } = req.body;

        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword

        });
        await user.save();

        res.status(201).json({message : "User generated succesfully "});
    } 
    catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
};

exports.login = async (req,res) => {
    try{
        const{email , password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })
        res.status(200).json({
            message: "Logged in successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });

    } 
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.logout = async (req,res) => {
    res.cookie('token','',{ expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
};