import axios from "axios";
export const dev = "http://192.168.8.3:4044/api/v1/";
export const prod = "https://betaback.tigrow.co/api/v1/";

// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = prod;

export default axios.create({
	baseURL: server
});
