const mongoose = require('mongoose');

const {Schema} = mongoose;

const pendingMember = new Schema(
	{
		email: {
			type: String,
			maxlength: 256,
			lowercase: true,
			trim: true,
			unique: false,
			required: true,
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			unique: false,
			required: true,
		},
		removed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

pendingMember.index({company: 1, email: 1}, {unique: true});

const PendingMember = mongoose.model('PendingMember', pendingMember);

module.exports = {
	PendingMember,
};
