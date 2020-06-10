const mongoose = require('mongoose');

const {Schema} = mongoose;

const RoomSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			unique: false,
			maxlength: 32,
			required: true,
		},
		members: [
			{
				type: Schema.ObjectId,
				ref: 'Account',
			},
		],
		company: {
			type: Schema.ObjectId,
			unique: false,
			ref: 'Company',
		},
		project: {
			type: Schema.ObjectId,
			unique: false,
			ref: 'Project',
		},
		account: {
			type: Schema.ObjectId,
			ref: 'Account',
		},
		archive: {
			type: Boolean,
			default: false,
		},
		removed: {
			type: Boolean,
			default: false,
		},
	},
	{timestamps: true},
);

RoomSchema.index({name: 1, company: 1, project: 1}, {unique: true});

const Room = mongoose.model('Room', RoomSchema);

module.exports = {
	Room,
};
