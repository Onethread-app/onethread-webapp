const mongoose = require('mongoose');

const {Schema} = mongoose;

const CommentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			trim: true,
			required: true,
		},
		taskId: {
			type: Schema.Types.ObjectId,
			ref: 'Task',
			required: true,
		},
		account: {
			type: Schema.ObjectId,
			ref: 'Account',
		},
		version: {
			type: Number,
			default: 0,
		},
	},
	{timestamps: true},
);

module.exports = mongoose.model('Comment', CommentSchema);
