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

const schema = {
<<<<<<< HEAD
    name: Joi.string(),
    department: idSchema.id,
    color: Joi.number(),
    project: idSchema.id,
    columns: Joi.array().items(idSchema.id),
    members: Joi.array().items(idSchema.id),
    removed: Joi.boolean(),
    boardId: idSchema.id,
=======
  name: Joi.string(),
  department: idSchema.id,
  color: Joi.number(),
  project: idSchema.id,
  columns: Joi.array().items(idSchema.id),
  members: Joi.array().items(idSchema.id),
  removed: Joi.boolean(),
  boardId: idSchema.id,
>>>>>>> 6d92f22e... Dev (#202)
};

module.exports = {
    createBoard: Joi.object().keys({
        body: Joi.object().keys({
            name: schema.name.required(),
            department: schema.department,
            projectId: schema.project,
            color: schema.color,
        }),
    }),
    getAllBoards: Joi.object().keys({
        params: schema.project,
    }),
    listAllBoards: Joi.object().keys({
        query: Joi.object().keys({
            pid: schema.project.required(),
        }),
    }),
    singleBoard: Joi.object().keys({
        params: Joi.object().keys({
            boardId: schema.boardId,
        }),
    }),
<<<<<<< HEAD
=======
  }),
  getAllBoards: Joi.object().keys({
    params: schema.project,
  }),
  listAllBoards: Joi.object().keys({
    query: Joi.object().keys({
      pid: schema.project.required(),
    }),
  }),
<<<<<<< HEAD
>>>>>>> fd446bca... validation & role add to project list
=======
  singleBoard: Joi.object().keys({
    params: Joi.object().keys({
      boardId: schema.boardId,
    }),
  }),
>>>>>>> 6d92f22e... Dev (#202)
};
