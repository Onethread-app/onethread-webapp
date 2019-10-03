import decode from "jwt-decode";

let token = localStorage.getItem('token') ? localStorage.getItem('token') : "";

const userId = localStorage.getItem('token') ? decode(token)._id : "";
const tokenUrl = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/8f737fc2-ce0a-4e83-952d-0081becf93c5/token";
const instanceLocator = "v1:us1:8f737fc2-ce0a-4e83-952d-0081becf93c5";

export { tokenUrl, instanceLocator, userId }