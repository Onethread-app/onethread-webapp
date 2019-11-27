import axios from "axios";

export const local = "http://192.168.8.252:4040/api/v1/";
export const dev = "http://192.168.8.252:4044/api/v1/";
export const prod = "http://13.228.250.57:8080/api/v1/";
export const server = local;

export default axios.create({
	baseURL: server
});
