import axios from "axios";

export const server = "http://192.168.1.5:4040/api/v1/";

export default axios.create({
	baseURL: server
});
