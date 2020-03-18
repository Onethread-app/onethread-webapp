import axios from 'axios';

export const local = 'http://192.168.1.5:4040/api/v1/';
export const test = 'https://test.tigrow.co/api/v1/';
export const prod = 'https://betaback.tigrow.co/api/v1/';
export const test1 = 'http://52.221.186.32:4044/api/v1/';
export const test2 = 'http://52.221.186.32:4046/api/v1/';
export const test3 = 'http://52.221.186.32:4047/api/v1/';
export const test4 = 'http://52.221.186.32:5002/api/v1/';
export const test5 = 'http://52.221.186.32:4001/api/v1/';
export const arif = 'http://52.221.186.32:1727/api/v1/';
export const nizam =
  'https://felt-inch-performing-equally.trycloudflare.com/api/v1/';
export const omer = 'http://192.168.8.67:4044/api/v1/';
// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = test4;

export const TokenUrlServer = `${server}chatkit/authenticate`;

export const InstanceLocator = process.env.REACT_APP_PUSHER_INSTANCE_LOCATOR;

export const tigrowApi = axios.create({
  baseURL: server
});
