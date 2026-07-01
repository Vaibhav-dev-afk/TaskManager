const jwt = require('jsonwebtoken');
const user = require('../models/User');

exports.protect = async(req,res,next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message: "Not Authorized, no token provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select('-password');

        if(!req.user){
            return res.status(401).json({ message: "User no longer exists" });
        }

        next();
    }
    catch(error){
        res.status(401).json({message: "Not authorized, token failed "});
    }

};