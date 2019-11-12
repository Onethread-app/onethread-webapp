import axios from "axios";

export const server = "http://192.168.8.252:4044/api/v1/";

export default axios.create({
	baseURL: server
});
