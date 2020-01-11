import axios from 'axios';

export const local = 'http://192.168.8.6:4040/api/v1/';
export const test = 'http://test.tigrow.co/api/v1/';
export const prod = 'https://betaback.tigrow.co/api/v1/';

// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = local;

export default axios.create({
	baseURL: server
});
