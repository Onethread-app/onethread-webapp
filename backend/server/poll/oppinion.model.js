const mongoose = require('mongoose');

const {Schema} = mongoose;

const tagLimit = function (tagList) {
	return tagList.length <= 10;
};

const OpinionSchema = new mongoose.Schema({
	text: {
		type: String,
		trim: true,
		maxlength: 200,
		required: true,
	},
	accepted: [
		{
			type: Schema.ObjectId,
			ref: 'User',
		},
	],
	removed: {
		type: Boolean,
		default: false,
	},
	blocked: {
		// after report admin
		type: Boolean,
		default: false,
	},
	updated: {
		type: Date,
	},
	created: {
		type: Date,
		default: Date.now,
	},
	poll: {
		type: Schema.ObjectId,
		ref: 'Poll',
	},
});

module.exports = mongoose.model('Opinion', OpinionSchema);
