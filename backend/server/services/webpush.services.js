const webpush = require('web-push');
const WebPushModel = require('../notification/webpush/webpush.model');
const { ServiceError } = require('../helpers/APIError');

const config = require('../../config/config');
const UserNotificationModel = require('../notification/userNotification.model');
const { UserMessage } = require('../message/userMessage.model');
const Account = require('../account/account.model');

const publicVapidKey = config.vapidPublicKey;
const privateVapidKey = config.vapidPrivateKey;

const logger = require('../../config/winston');

webpush.setVapidDetails(config.clientUrl, publicVapidKey, privateVapidKey);

const webPushTTL = 60;

const savePushSubscription = (account, pushSubscription) => {
  return WebPushModel.create({ account, pushSubscription });
};

const removePushSubscription = async (subscriptionId) => {
  if (!subscriptionId) return;
  const pushSub = await WebPushModel.findByIdAndDelete(subscriptionId);
  if (!pushSub) {
    throw new ServiceError(
      'SubscriptionNotFoundError',
      `Subscription not found with this ID: ${subscriptionId}`,
      404,
    );
  }
};

const triggerNotification = async (memberId, dataToSend) => {
  try {
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
          await removePushSubscription(subscriptions[i]._id);
        } else {
          logger.error(`${err}`);
        }
      }
    }
  } catch (err) {
    logger.error(
      `We were unable to send messages to all subscriptions: '${err.message}'`,
    );

    throw new ServiceError(
      'WebPushError',
      `We were unable to send messages to all subscriptions :  '${err.message}'`,
      err.statusCode || 500,
    );
  }
};

const triggerUnreadNotifications = async (memberId) => {
  const accInf = await Account.findById(memberId).select('name');
  const username = accInf.name;
  const numOfUnreadNotif = await UserNotificationModel.find({
    account: memberId,
    read: false,
    seen: false,
  }).countDocuments();
  let message = `You have 1 unread notification`;
  if (numOfUnreadNotif > 1) {
    message = `You have ${numOfUnreadNotif} unread notifications`;
  }
  const dataToSend = {
    notification: {
      title: 'One Thread',
      body: `${message}`,
      icon: '/logo512.png',
      data: `/${username}/notifications`,
      TTL: webPushTTL,
    },
  };

  await triggerNotification(memberId, dataToSend);
};

const triggerMessage = async (memberId, dataToSend) => {
  try {
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
          await removePushSubscription(subscriptions[i]._id);
        } else {
          logger.error(`${err}`);
        }
      }
    }
  } catch (err) {
    logger.error(
      `We were unable to send messages to all subscriptions: '${err.message}'`,
    );

    throw new ServiceError(
      'WebPushError',
      `We were unable to send messages to all subscriptions :  '${err.message}'`,
      err.statusCode || 500,
    );
  }
};

const triggerUnreadMessages = async (memberId) => {
  const accInf = await Account.findById(memberId).select('name');
  const username = accInf.name;
  const numOfUnreadNotif = await UserMessage.find({
    account: memberId,
    read: false,
  }).countDocuments();
  let message = `You have 1 unread message`;
  if (numOfUnreadNotif > 1) {
    message = `You have ${numOfUnreadNotif} unread message`;
  }
  const dataToSend = {
    notification: {
      title: 'One Thread',
      body: `${message}`,
      icon: '/logo512.png',
      data: `/${username}/home`,
      TTL: webPushTTL,
    },
  };

  await triggerMessage(memberId, dataToSend);
};

module.exports = {
  webpush,
  savePushSubscription,
  removePushSubscription,
  triggerNotification,
  triggerUnreadNotifications,
  triggerMessage,
  triggerUnreadMessages,
};
