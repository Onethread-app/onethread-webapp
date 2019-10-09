import decode from "jwt-decode";

const token: string | null = localStorage.hasOwnProperty('token') ? localStorage.getItem('token') : "";

export const UserId = localStorage.getItem('token') ? token ? (decode(token) as any)._id : "" : "";
export const TokenUrl = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/8f737fc2-ce0a-4e83-952d-0081becf93c5/token";
export const InstanceLocator = "v1:us1:8f737fc2-ce0a-4e83-952d-0081becf93c5";