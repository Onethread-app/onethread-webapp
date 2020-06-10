const mongoose = require('mongoose');

const {Schema} = mongoose;

// company schema
const projectRequestSchema = new Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
        associate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Associate',
        },
        size: {
            type: Number,
            min: 1,
            max: 50,
        },
        version: {
            type: Number,
            default: 0,
        },
        isAccepted: {
            type: Boolean,
            default: false,
        },
        isRejected: {
            type: Boolean,
            default: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
    },
    {
        timestamps: true,
    },
);

const ProjectRequest = mongoose.model('ProjectRequest', projectRequestSchema);

module.exports = {
    ProjectRequest,
};
