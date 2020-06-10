const Joi = require('@hapi/joi');

module.exports = {
	createSave: {
		body: {
			reportType: Joi.string()
				.valid(
					'harmful',
					'violence',
					'threat',
					'annoying',
					'gross',
					'false',
					'abusive',
					'pornography',
					'spam',
					'compromise',
					'offensive',
					'disrespectful',
					'privateExposed',
					'others',
				)
				.required(),
			text: Joi.string().required(),
			reviewText: Joi.string(),
			reportContent: Joi.string().valid('post', 'comment', 'user').required(),
			reviewStatus: Joi.string().valid(
				'block',
				'noofense',
				'notresoolved',
				'others',
			),
			refrence: Joi.string().regex(/^[0-9a-fA-F]{24}$/), // user comment or post query define that
		},
	},
};
