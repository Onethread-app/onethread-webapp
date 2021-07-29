const Comment = require('./comment.model');
const logger = require('../../config/winston');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const TaskAssign = require('../task/taskAssign.model');
const SubTaskAssign = require('../task/subtask/subtask.model');
const {notifyToTaskMember }= require('../notification/notification.controller');
const load = (req, res, next, id) => {
  Comment.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        req.comment = result;
        return next();
      }
      return res
        .status(400)
        .json({ message: 'No valid entry found for provided ID' });
    })
    .catch((err) => {
      logger.error(`Comment: ${err}`);
      next(err);
    });
};
const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}
const create = async (req, res, next) => {
  const comment = new Comment({
    text: req.body.text,
    account: req.user._id,
    taskId: req.body.taskId,
  });
  comment
    .save()
    .then(async result => {
      let taskMembers = await TaskAssign.find({taskId: result.taskId})
                              .select('assignedPerson')
                              .populate('assignedPerson taskId', '_id account');
      let memberList =[];
      // TO-do: can combine both logic??
      if( taskMembers !== null || taskMembers.length > 0){
        let taskAssignMembers=taskMembers.map(task => task.assignedPerson);
        memberList = taskAssignMembers.map(task=> task._id.toString());
      }
      else{
        let subTaskMembers = await SubTaskAssign.find({taskId: result.taskId})
                                .populate('assignedMember');
        if( subTaskMembers !== null || subTaskMembers.length > 0 ){
          subTaskMembers.forEach( member=>{
            let subTaskAssignMember = (member.assignedMembers[0]);
            memberList.push(subTaskAssignMember.toString());            
          })
          
        }
      }
      if(taskMembers.length === 0){
        return sendJSONresponse(res, 201, result);
      }
      memberList.push(taskMembers[0].taskId.account.toString());
      memberList = memberList.filter(onlyUnique);
      memberList.map(async member=>{
        if(member.toString() !== req.user._id){
          await notifyToTaskMember(
            req.user._id,
            req.headers.companyid,
            req.body.taskId,
            {
              _id: req.user._id,
              name: req.user.name,
              pusherSock: req.headers.clientid,
            },
            member
          )
        }
        logger.info(`successfully notify to user`);
      })
      return sendJSONresponse(res, 201, result);
    })
    .catch(error =>{
      console.log(error);
      logger.error(`comment: ${error}`);
      next(error);
    })
};

const list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const comments = await Comment.find({ taskId: req.query.taskId })
    .select('_id text account createdAt')
    .populate([
      {
        path: 'account',
        select: '_id firstName lastName profileImage position',
      },
    ])
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()

    return sendJSONresponse(res,200,comments);
    
  } catch (error) {
    logger.error(`Comment: ${error}`);
    next(error);
  }
};

module.exports = {
  load,
  create,
  list,
};
