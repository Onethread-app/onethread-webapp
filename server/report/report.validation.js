const Joi = require("joi");

module.exports = {
  createSave: {
    body: {
<<<<<<< HEAD
=======
      reportType: Joi.string()
        .valid(
          "harmful",
          "violence",
          "threat",
          "annoying",
          "gross",
          "false",
          "abusive",
          "pornography",
          "spam",
          "compromise",
          "offensive",
          "disrespectful",
          "privateExposed",
          "others"
        ).required(),
>>>>>>> master
      text: Joi.string().required(),
      refrence: Joi.string().regex(/^[0-9a-fA-F]{24}$/) //user comment or post query define that
    }
  }
};
