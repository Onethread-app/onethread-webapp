import axios from "axios";

export default axios.create({
	baseURL: "http://localhost:4040/api/v1/"
	// baseURL: "http://13.235.75.2:4040/api/v1/"
});
