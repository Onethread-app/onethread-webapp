const Joi = require('@hapi/joi');
module.exports = {
	create: Joi.object().keys({
		body: Joi.object().keys({
			name: Joi.string()
				.lowercase()
				.required()
				.error(error => {
					return { success: false, message: `recheck` };
				}),
		}),
	}),

	update: Joi.object().keys({
		body: Joi.object().keys({
			skillArea: Joi.string().error(error => {
				return { success: false, message: `must provide skillId` };
			}),
		}),
	}),
	search: Joi.string().min(1),
};
