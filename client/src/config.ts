import axios from 'axios';

export const test = 'https://test.tigrow.co/api/v1/';
export const prod = 'https://api.tigrow.co/api/v1/';
export const dev = 'http://52.221.186.32:4046/api/v1/';
export const nizam = 'http://a6c5f168.ngrok.io/api/v1/';

// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = nizam;

export const PUSHER_CHANNEL_AUTH_END_POINT = `http://8e18abfd.ngrok.io/api/v1/channel/authenticate`;
export const PUSHER_CHANNEL_KEY =
  process.env.REACT_APP_PUSHER_CHANNEL_KEY;
export const PUSHER_CHANNEL_CLUSTER =
  process.env.REACT_APP_PUSHER_CHANNEL_CLUSTER;

export const tigrowApi = axios.create({
  baseURL: server,
});
