const Joi = require('@hapi/joi');
// id
const idSchema = {
	id: Joi.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.error((errors) => {
			return {
				message: 'Invalid ID',
			};
		}),
};

// joi schema
const schema = {
	member: idSchema.id,
	division: Joi.string().valid([
		'director',
		'cxo',
		'seniorManager',
		'middleManager',
		'operationalEmployee',
	]),
	department: idSchema.id,
	position: Joi.string(),
	designation: idSchema.id,
};

// memberId
const memberId = Joi.object().keys({
	memberId: idSchema.id.required(),
});

module.exports = {
	create: Joi.object().keys({
		body: Joi.object().keys({
			division: schema.division.required(),
			department: schema.department,
			position: schema.position.required(),
		}),
		params: memberId,
	}),
	edit: Joi.object().keys({
		body: Joi.object().keys({
			division: schema.division.required(),
			department: schema.department,
			position: schema.position.required(),
			designation: schema.designation.required(),
		}),
		params: memberId,
	}),
	list: Joi.object().keys({
		params: memberId,
	}),
};
