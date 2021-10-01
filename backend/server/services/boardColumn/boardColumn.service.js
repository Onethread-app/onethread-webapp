const BoardColumn = require('../../boardColumn/boardColumn.model');


const findColumnById = async (_id) => {
  return await BoardColumn.findOne({
    _id: _id,
  })
    .select('name')
    .exec();
  logger.info(`ColumnId successfully retrived`);
};
module.exports = {
  findColumnById,
};
