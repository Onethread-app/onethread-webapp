const { Company } = require('../../company/company.model');
const { Member } = require('../../company/member/member.model');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../../helpers/jsonResponse');

const { webpush } = require('../../services/webpush.services');
const WebPushVal = require('./webpush.validation');
const WebPushModel = require('./webpush.model');

module.exports.saveSubscription = async (req, res, next) => {
  const { error } = WebPushVal.saveSubscription(req.body);
  if (error) {
    return sendErrorResponse(res, 400, 'ValidationError', {
      message: error.details[0].message,
    });
  }
  const subscription = new WebPushModel(req.body);
  await subscription.save();

  return sendJSONresponse(res, 201, { success: true, subscription });
};

module.exports.removeSubscription = async (req, res, next) => {
  const { subscriptionId } = req.params;
  const subscription = await WebPushModel.findByIdAndDelete(
    subscriptionId,
  );
  if (!subscription) {
    return sendErrorResponse(res, 404, 'SubscriptionNotFoundError', {
      message: `Subscription not found with this ID: ${subscriptionId}`,
    });
  }

  return sendJSONresponse(res, 200, { success: true });
};

module.exports.triggerNotification = async (req, res, next) => {
  const { error } = WebPushVal.triggerNotification(req.body);
  if (error) {
    return sendErrorResponse(res, 400, 'ValidationError', {
      message: error.details[0].message,
    });
  }
  const { announcementText } = req.body;
  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) {
    return sendErrorResponse(res, 404, 'CompanyNotFoundError', {
      message: `Company not found with this ID: ${companyId}`,
    });
  }
  const dataToSend = {
    notification: {
      title: `Announcement from ${company.name}`,
      body: announcementText,
      icon: company.logo,
      data: `company/${company.uniqueName}/dashboard`,
    },
  };
  const members = await Member.find({ company: companyId }).select(
    'account',
  );

  const isEqual = (a, b) => a.toString() === b.toString();

  try {
    for (let index = 0; index < members.length; index++) {
      const memberId = members[index].account;
      if (isEqual(memberId, req.user._id)) continue;

      const subscriptions = await WebPushModel.find({
        account: memberId,
      }).select('pushSubscription');

      for (let i = 0; i < subscriptions.length; i++) {
        try {
          await webpush.sendNotification(
            JSON.parse(subscriptions[i].pushSubscription),
            JSON.stringify(dataToSend),
          );
        } catch (err) {
          if (err.statusCode === 404 || err.statusCode === 410) {
            await WebPushModel.findByIdAndDelete(
              subscriptions[i]._id,
            );
          }
        }
      }
    }
    return sendJSONresponse(res, 200, { success: true });
  } catch (err) {
    let message = `We were unable to send messages to all subscriptions :  '${err.message}'`;
    return res
      .status(err.statusCode || 500)
      .json({ success: false, message });
  }
};
