import axios from 'axios';

export const test = 'https://test.tigrow.co/api/v1/';
export const prod = 'https://api.tigrow.co/api/v1/';
export const dev = 'http://52.221.186.32:4046/api/v1/';

// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = process.env.REACT_APP_API_URL;

export const PUSHER_CHANNEL_AUTH_END_POINT = `${server}channel/authenticate`;

export const PUSHER_CHANNEL_KEY =
  process.env.REACT_APP_PUSHER_CHANNEL_KEY;
export const PUSHER_CHANNEL_CLUSTER =
  process.env.REACT_APP_PUSHER_CHANNEL_CLUSTER;

export const NOTIFICATION_KEY =
  process.env.NOTIFICATION_PUSHER_CHANNEL_KEY;
export const NOTIFICATION_CLUSTER =
  process.env.NOTIFICATION_PUSHER_CHANNEL_CLUSTER;

export const tigrowApi = axios.create({
  baseURL: server,
});
