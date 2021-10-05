const Notification = require('../../notification/notification.model');
const UserNotification = require('../../notification/userNotification.model');
const createNotification = async (data) => {
  return await Notification.create(data);
};
const createNotificationForUser = async (data) => {
  return await UserNotification.create(data);
};
module.exports = {
  createNotification,
  createNotificationForUser,
};
