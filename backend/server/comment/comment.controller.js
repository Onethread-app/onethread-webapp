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
      next(err);
    });
};

const create = async (req, res, next) => {
  const comment = new Comment({
    text: req.body.text,
    account: req.user._id,
    taskId: req.body.taskId,
  });

  comment
    .save()
    .then(async result => {
      let taskMembers = await TaskAssign.find({taskId: req.body.taskId})
                              .select('assignedPerson')
                              .populate('assignedPerson', '_id');
      let taskAssignMembers=taskMembers.map(task => task.assignedPerson);
      let memberList = taskAssignMembers.map(task=> task._id);
      let subTaskMembers = await SubTaskAssign.findOne({taskId: req.body.taskId})
                                .populate('assignedMember');
      let subTaskAssignMember = (subTaskMembers.assignedMembers);
      let totalMember =memberList.concat(subTaskAssignMember.filter((item) => memberList.indexOf(item) < 0));
      let memberNotify=totalMember.filter((item, pos) => totalMember.indexOf(item) === pos);
      memberNotify.map(async member=>{
        if(member !== req.user._id){
          await notifyToTaskMember(
            req.user._id,
            req.headers.companyid,
            req.query.pid,
            req.body.taskId,
            {
              _id: req.user._id,
              name: req.user.name,
              pusherSock: req.headers.clientid,
            },
            member
          )
        }
      })
      return sendJSONresponse(res, 201, result);
    })
    .catch(error =>{
      console.log(error);
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
