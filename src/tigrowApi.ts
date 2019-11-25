import axios from "axios";

export const local = "http://localhost:4040/api/v1/";
export const dev = "http://192.168.8.252:4044/api/v1/";
export const prod = "http://betaback.tigrow.co/api/v1/";
export const server = local;

export default axios.create({
	baseURL: server
});
