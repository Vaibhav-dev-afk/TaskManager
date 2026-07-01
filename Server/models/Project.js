
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members:[
        {
            User:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'User',
            },
            role:{
                type: String,
                default: "member",
            }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('Project',projectSchema);