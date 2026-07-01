const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status:{
        type: String,
        enum: ['to-do','inprogress','completed'],
        default: 'to-do',
    },
    priority:{
        type: String,
        enum: ['low','medium','high'],
        default: 'medium',
    },
    duedate:{
        type: Date,
    },
}, { timestamps: true});

module.exports = mongoose.model('Task', taskSchema);