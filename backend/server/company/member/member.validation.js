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
	account: idSchema.id,
	company: idSchema.id,
	department: idSchema.id,
	division: idSchema.id,
	position: Joi.string(),
	role: Joi.string().valid([
		'superAdmin',
		'admin',
		'manager',
		'moderator',
		'employee',
	]),
};

// memberId
const memberId = Joi.object().keys({
	memberId: idSchema.id.required(),
});

module.exports = {
	newMember: Joi.object().keys({
		body: Joi.object().keys({
			account: schema.account.required(),
			department: schema.department.required(),
			division: schema.division.required(),
			position: schema.position.required(),
		}),
	}),
	getMember: Joi.object().keys({
		params: memberId,
	}),
	deleteMember: Joi.object().keys({
		params: memberId,
	}),
	changeRole: Joi.object().keys({
		body: Joi.object().keys({
			role: schema.role.required(),
		}),
		params: memberId,
	}),
	checkInvitedMemberStatus: Joi.object().keys({
		query: Joi.object().keys({
			email: Joi.string()
				.regex(
					/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				)
				.lowercase()
				.min(3)
				.max(62)
				.required()
				.error((error) => {
					return {
						message: 'Invalid email format',
					};
				}),
		}),
	}),
	// updateCompany: Joi.object().keys({
	//   body: Joi.object().keys({
	//     address: schema.address.required(),
	//     email: schema.email,
	//     legalOwnerName: schema.legalOwnerName,
	//     legalOwnerMail: schema.legalOwnerMail,
	//     about: schema.about,
	//   }),
	//   params: cname,
	// }),
	// deleteCompany: Joi.object().keys({
	//   params: cname,
	// }),
};
