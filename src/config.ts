import axios from 'axios';

export const local = 'http://192.168.8.32:4040/api/v1/';
export const test = 'https://test.tigrow.co/api/v1/';
export const prod = 'https://betaback.tigrow.co/api/v1/';
export const test1 = 'http://52.221.186.32:4044/api/v1/';
export const test2 = 'http://52.221.186.32:4046/api/v1/';
export const test3 = 'http://52.221.186.32:1727/api/v1/';
export const test4 = 'http://52.221.186.32:4047/api/v1/';
// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = local;

export const TokenUrlServer = `${server}chatkit/authenticate`;

export const InstanceLocator = process.env.REACT_APP_PUSHER_INSTANCE_LOCATOR;

export const tigrowApi = axios.create({
	baseURL: server
});