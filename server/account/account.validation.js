const Joi = require("joi");

module.exports = {
	register: {
		body: {
			email: Joi.string()
				.regex(
					/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)
				.lowercase()
				.required(),
			password: Joi.string()
				.regex(
					/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/
				)
				.required()
<<<<<<< HEAD
				.error(errors => {
					return {
						message:
							"Password should contain Uppercase, Lowercase, Special character, Number"
					};
				})
=======
>>>>>>> c48479f5... nothing speacial
		}
	}
};
