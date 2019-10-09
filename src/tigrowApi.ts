import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.8.252:4044/api/v1/"
});
