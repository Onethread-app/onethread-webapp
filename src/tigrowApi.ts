import axios from "axios";

export const local = "http://192.168.8.64:4040/api/v1/";
export const dev = "http://192.168.8.64:4044/api/v1/";
export const prod = "https://betaback.tigrow.co/api/v1/";
export const server = local;

export default axios.create({
	baseURL: server
});
