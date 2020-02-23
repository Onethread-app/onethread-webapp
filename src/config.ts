import axios from 'axios';

export const local = 'http://localhost:4040/api/v1/';
export const test = 'https://test.tigrow.co/api/v1/';
export const prod = 'https://betaback.tigrow.co/api/v1/';
// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = local;

export const TokenUrlServer = `${server}chatkit/authenticate`;

export const InstanceLocator = process.env.REACT_APP_PUSHER_INSTANCE_LOCATOR;

export const tigrowApi = axios.create({
	baseURL: server
});