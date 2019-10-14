const JobExperience = require('./job.model');
const Account = require('../account/account.model');
const { sendJSONresponse } = require('../helpers/jsonResponse.js');
const createJobExperience = async (req, res, next) => {
  const account = await Account.findById(req.user._id);
  const newJobExperience = new JobExperience({
    companyName: req.body.companyName,
    positionName: req.body.positionName,
    startYear: req.body.startYear,
    endingYear: req.body.endingYear,
    currentlyWork: req.body.currentlyWork,
    account: req.user._id,
  });
  await newJobExperience
    .save()
    .then(async data => {
      account.jobExperience.push(data._id);
      await account.save();
      return sendJSONresponse(res, 201, { data });
    })
    .catch(err => {
      return next(err);
    });
};

const updateJobExperience = async(req, res)=> {
	jobExperience.findByIdAndUpdate(req.params.jobexperienceid, function(err, user){
		if(err){throw new error('Error FInd')}
		else{
			user.companyName = req.body.companyName;
			user.positionName = req.body.positionName;
			user.startYear = req.body.startYear;
			user.endingYear = req.body.endingYear;
			user.currentlyWork = req.body.currentlyWork;
		}
	})
	.exec()

}
module.exports = { createJobExperience, updateJobExperience };
