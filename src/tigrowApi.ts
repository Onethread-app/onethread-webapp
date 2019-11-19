import axios from "axios";

export const dev = "http://192.168.8.75:4040/api/v1/";
export const prod = "http://betaback.tigrow.co/api/v1/";
export const server = dev;

export default axios.create({
	baseURL: server
});