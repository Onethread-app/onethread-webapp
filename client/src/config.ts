import axios from 'axios';

export const test = 'https://test.tigrow.co/api/v1/';
export const prod = 'https://api.tigrow.co/api/v1/';
export const dev = 'http://localhost:4044/api/v1/';

// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = process.env.REACT_APP_API_URL;

export const PUSHER_CHANNEL_AUTH_END_POINT = `${server}channel/authenticate`;

export const PUSHER_CHANNEL_KEY =
  process.env.REACT_APP_PUSHER_CHANNEL_KEY;
export const PUSHER_CHANNEL_CLUSTER =
  process.env.REACT_APP_PUSHER_CHANNEL_CLUSTER;

<<<<<<< HEAD
<<<<<<< HEAD
export const NOTIFICATION_KEY =
  process.env.REACT_APP_PUSHER_CHANNEL_KEY;
export const NOTIFICATION_CLUSTER =
  process.env.REACT_APP_PUSHER_CHANNEL_CLUSTER;
=======

export const NOTIFICATION_KEY = process.env.NOTIFICATION_PUSHER_CHANNEL_KEY;
export const NOTIFICATION_CLUSTER = process.env.NOTIFICATION_PUSHER_CHANNEL_CLUSTER;
>>>>>>> 1d9824de... Bugfix/controller (#259)
=======

export const NOTIFICATION_KEY = process.env.NOTIFICATION_PUSHER_CHANNEL_KEY;
export const NOTIFICATION_CLUSTER = process.env.NOTIFICATION_PUSHER_CHANNEL_CLUSTER;
>>>>>>> 21b22403... notification issue fix (#244)

export const tigrowApi = axios.create({
  baseURL: server,
});
