import axios from 'axios';

export const test = 'https://test.tigrow.co/api/v1/';
export const prod = 'https://api.tigrow.co/api/v1/';
export const dev = 'http://localhost:4044/api/v1/';

// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = process.env.REACT_APP_API_URL;
export const adminServer = process.env.REACT_APP_ADMIN_API_URL;

export const PUSHER_CHANNEL_AUTH_END_POINT = `${server}channel/authenticate`;

export const PUSHER_CHANNEL_KEY =
  process.env.REACT_APP_PUSHER_CHANNEL_KEY;
export const PUSHER_CHANNEL_CLUSTER =
  process.env.REACT_APP_PUSHER_CHANNEL_CLUSTER;

export const NOTIFICATION_KEY =
  process.env.REACT_APP_PUSHER_CHANNEL_KEY;
export const NOTIFICATION_CLUSTER =
  process.env.REACT_APP_PUSHER_CHANNEL_CLUSTER;
export const VAPID_PUBLIC_KEY =
  process.env.REACT_APP_VAPID_PUBLIC_KEY;
export const tigrowApi = axios.create({
  baseURL: server,
});

export const tigrowAdminApi = axios.create({
  baseURL: adminServer,
});

export const PAGE_ID = process.env.REACT_APP_PAGE_ID;
export const APP_ID = process.env.REACT_APP_APP_ID;
export const WHATSAPP_URL = process.env.REACT_APP_WHATSAPP_URL;
