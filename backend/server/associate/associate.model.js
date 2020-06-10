const mongoose = require('mongoose');

const {Schema} = mongoose;

const AssociateSchema = new mongoose.Schema(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            unique: false,
            required: true,
        },
        associateCompany: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            unique: false,
            required: true,
        },
        removed: {
            type: Boolean,
            default: false,
        },
        isAccepted: {
            type: Boolean,
            default: false,
        },
        isRejected: {
            type: Boolean,
            default: false,
        },
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
        },
        project: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Project',
            },
        ],
        version: {
            type: Number,
            default: 0,
        },
    },
    {timestamps: true},
);

AssociateSchema.index({associateCompany: 1, company: 1}, {unique: true});
const Associate = mongoose.model('Associate', AssociateSchema);

module.exports = {
    Associate,
};
