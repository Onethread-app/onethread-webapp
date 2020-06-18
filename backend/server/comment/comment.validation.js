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

const commentId = Joi.object().keys({
  commentId: idSchema.id.required(),
});

const commentSchema = {
  text: Joi.string(),
  taskId: idSchema.id,
};

const commentReplySchema = {
  text: Joi.string(),
  commentId: idSchema.id,
  taskId: idSchema.id,
};

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      text: commentSchema.text.required(),
      taskId: commentSchema.taskId.required(),
    }),
  }),
  createReply: Joi.object().keys({
    body: Joi.object().keys({
      text: commentReplySchema.text.required(),
      taskId: commentReplySchema.taskId.required(),
    }),
    params: commentId,
  }),
};
