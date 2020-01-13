import axios from 'axios';

export const urls = {
	production: 'https://betaback.tigrow.co/api/v1/',
	development: 'http://test.tigrow.co/api/v1/',
	test: 'http://test.tigrow.co/api/v1/'
};

export const server = urls[process.env.NODE_ENV];

export default axios.create({
	baseURL: server
});
