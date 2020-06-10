const {Schema, model} = require('mongoose');

const RoomMemberSchema = new Schema(
    {
        account: {
            type: Schema.ObjectId,
            ref: 'Account',
            unique: false,
            required: true,
        },
        team: {
            type: Schema.ObjectId,
            ref: 'Team',
            unique: false,
            required: true,
        },
        company: {
            type: Schema.ObjectId,
            unique: false,
            ref: 'Company',
            required: true,
        },
        project: {
            type: Schema.ObjectId,
            unique: false,
            ref: 'Project',
            required: true,
        },
        room: {
            type: Schema.ObjectId,
            ref: 'Room',
            unique: false,
            required: true,
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        removed: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true},
);

RoomMemberSchema.index(
    {account: 1, team: 1, company: 1, project: 1, room: 1},
    {unique: true},
);

const RoomMember = model('RoomMember', RoomMemberSchema);

module.exports = {
    RoomMember,
};
