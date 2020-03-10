const Account = require('../account/account.model');
const mongoose = require('mongoose');
const { Associate } = require('../associate/associate.model');
const { Company } = require('./company.model');
const { Member } = require('./member/member.model');
const { Room } = require('./../room/room.model');
const { chatkit } = require('../services/pusher.services');
const { sendErrorResponse } = require('../helpers/jsonResponse');
const ElasticsearchService = require('../../index.elasticsearch');
const elasticService = new ElasticsearchService();
const logger = require('../../config/winston');

// create a company profile
const changeName = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {message:"Expects 'application/json'"})
  }

  try {
    // check member & role: superAdmin/admin
    const member = await Member.findOne({
      account: req.user._id,
      company: req.company._id,
    });

    if (!member || !['superAdmin', 'admin'].includes(member.role)) {
      return res.status(403).json({
        message: `Restricted`,
      });
    }

    // check duplicate company name
    const duplicate = await Company.findOne({
      name: req.body.name,
    });
    if (duplicate) {
      return res.status(409).json({
        message: `Name already exist`,
      });
    }

    req.company.name = req.body.name;
    await req.company.save();

    return res.status(200).json({
      message: `Company's name updated`,
    });
  } catch (error) {
    next(error);
  }
};

// create a company profile
const createCompany = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {message:"Expects 'application/json'"})
  }

  try {
    // check duplicate company name
    const duplicate = await Company.findOne({
      name: req.body.name,
    });
    if (duplicate) {
      return res.status(409).json({
        message: `Duplicate company name`,
      });
    }

    req.body.account = req.user._id;
    const newCompany = new Company(req.body);

    // create a default room
    // const newRoom = new Room({
    //   name: 'General',
    //   company: newCompany._id,
    //   members: [req.user._id],
    //   account: req.user._id,
    // });

    // create a default member
    const newMember = new Member({
      account: req.user._id,
      company: newCompany._id,
      role: 'superAdmin',
    }).populate({
      path : 'account' ,
      select: '_id name'
    });

    console.log(newMember);

    // add ref[member,room] in company
    //newCompany.members.push(newMember._id);
    // newCompany.rooms.push(newRoom._id);

    // company creation
    const company = await newCompany.save();
    // const room = await newRoom.save();
    // await chatkit.createRoom({
    //   id: room._id,
    //   creatorId: req.user._id,
    //   name: room.name,
    //   customData: {
    //     company: company._id,
    //   },
    // });
    const elasticMember = await newMember.save();

  const elasticMemberPopulated =  Member.find({
    _id:elasticMember._id
  }).populate({ path: 'account', select: '_id name firstName lastName email' });
   
  const response =  await elasticService.set('members','_doc' , {
      mongo_id: elasticMemberPopulated._id,
      account: elasticMemberPopulated.account,
      company: elasticMemberPopulated.company
    });

    console.log(elasticMemberPopulated)

    logger.info(` ✔ ️Elasticsearch document ${response.result}`);

    // // add company ref in user
    // req.user.companies.push(newCompany._id);
    // await req.user.save();

    return res.status(201).json({
      message: 'New company created',
      company: {
        _id: company._id,
        name: company.name,
        type: company.type,
        email: company.email,
        address: company.address,
        legalOwnerName: company.legalOwnerName,
        legalOwnerMail: company.legalOwnerMail,
        role: 'superAdmin',
      },
    });
  } catch (error) {
    
    return next(error);
  }
};

// get companies list for individual user
const getCompanyIndividual = async (req, res, next) => {
  try {
    // populate options
    let options = [
      {
        path: 'company',
        select: '_id name',
        // populate: [
        //   {
        //     path: 'logo',
        //     select: 'link s3Key type',
        //   },
        // ],
      },
    ];

    let companies = await Member.find({
      account: req.params.account,
      removed: false,
    })
      .select('-_id company role')
      .populate(options);

    return res.status(200).json({
      companies,
    });
  } catch (error) {
    next(error);
  }
};

// get a company profile
const getCompany = async (req, res, next) => {

  
  try {
    // company details
    let company = await Company.findOne({
      name: req.params.cname,
    })
      .select(
        '-account -websites -members -rooms -products -departments -divisions -createdAt -updatedAt -__v',
      );

    // role info
    let member = await Member.findOne({
      account: req.user._id,
      company: company._id,
    }).select('-_id role');

    // if (!member) {
    //   return res.status(401).json({
    //     message: "You're not authorized with this company",
    //   });
    // }

    return res.status(200).json({
      company: { ...company._doc, role: member.role },
    });
  } catch (error) {
    
    next(error);
  }
};

// update a company basic info
const updateBasicInfo = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {message:"Expects 'application/json'"})
  }
  
  try {
    
    // updating new values
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.company[key] = req.body[key];
      }
    }

    await req.company.save();

    return res.status(200).json({
      message: `Company's basic information updated`,
    });
  } catch (error) {
    
    next(error);
  }
};

// update a company basic info
const updateAbout = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {message:"Expects 'application/json'"})
  }
  
  try {
    
    req.company.about = req.body.about;


    await req.company.save();

    return res.status(200).json({
      message: `Company's about updated`,
    });
  } catch (error) {
    
    next(error);
  }
};

// update a company role
const updateRole = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }
  
  try {
    //Company.deleteMany({}, function(err, result) {
      
    //});
    //req.company.optionalRole = req.body.optionalRole;
    const company = await Company.findOneAndUpdate(
      { _id: req.company._id },
      { $set: { optionalRole: req.body.optionalRole } },
      {
        safe: true,
        upsert: true,
      },
    ).exec();

    //await req.company.save();

    return res.status(200).json({
      message: `Company's role updated`,
      data: company.optionalRole,
    });
  } catch (error) {
    
    next(error);
  }
};

// company will be found on req.company
const getCompanyLoad = async (req, res, next) => {
  try {
    
    const company = await Company.findOne({
      _id: req.params.companyId,
    }).populate('account', '_id firstName lastName email contactNo');

    if (company) {
      req.company = company;
      return next();
    } else {
      return res.status(404).json({
        message: 'No valid entry found for provided Company Name',
      });
    }
  } catch (error) {
    next(error);
  }
};

// TODO: will be soft delete before production
const deleteCompany = async (req, res, next) => {
  Company.findByIdAndRemove({ _id: req.params.id })
    .exec()
    .then(result => {
      if (result) {
        //Store this company's ref into Account
        Account.findOneAndUpdate(
          { _id: req.user._id },
          { $pull: { companies: req.params.id } },
          {
            safe: true,
            upsert: true,
          },
        )
          .exec()
          .then(data => {
            res.status(200).json({
              message: 'Company deleted',
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err,
            });
          });
      } else {
        res.status(404);
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

const authorizeUser=  (functionalRole, ...userRoles )=> {

  return async function  (req, res, next) {
    
    try {

      // const company =  await Company.findOne({
      //   _id: req.params.companyId,
      // }).select('_id optionalRole').exec();
      

      const member = await Member.findOne({
        account: req.user._id,
        "company" : req.params.companyId, //apatoto pore name or id hobe
      }).exec();

      // if (
      //   !member ||
      //   !userRoles.includes(member.role) ||
      //   !company.optionalRole.includes(functionalRole)
      // )
     
console.log(member, userRoles, functionalRole, 'a');
      if ( !member   || (
        functionalRole === 'all' &&
        !userRoles.includes(member.role)  
      ) 
      ) {
        return res.status(403).json({
          message: `Restricted`,
        });
      }

      next();
    } catch (error) {      
      next(error);
    }
  };
};

const searchCompany = async (req, res, next) => {
  
  try {
    const { limit = 50, skip = 0 , name, companyId} = req.query;
    const associate = await Associate.find({
       $or:[ {company: companyId}, {associateCompany: companyId} ],
       isRejected:false,

      }).exec();

    let associateCompanyId = associate.map(m => {
      if(m.company.toString() === companyId){
        return m.associateCompany;
      }
      return m.company;
    });

    associateCompanyId.push(companyId);
    await Company.find({
      name: { $regex: new RegExp(name), $options: 'i' },
      _id: { $nin: associateCompanyId}
    })
      .select('name')
      .skip(+skip)
      .limit(+limit)
      .then(data => {
        
        return sendJSONresponse(res, 200, {
          success: true,
          message: `Search complete for ${name}`,
          data,
        });
      });
  } catch (error) {
    
    next(error);
  }
};


module.exports = {
  authorizeUser,
  createCompany,
  getCompany,
  updateBasicInfo,
  updateRole,
  updateAbout,
  getCompanyIndividual,
  changeName,
  deleteCompany,
  getCompanyLoad,
  searchCompany,
};
