import decode from 'jwt-decode';
import { server } from 'tigrowApi';

const token: string | null = localStorage.hasOwnProperty('token') ? localStorage.getItem('token') : '';

export const UserId = localStorage.getItem('token') ? token ? (decode(token) as any)._id : '' : '';

export const TokenUrl = process.env.REACT_APP_PUSHER_TOKEN_URL;

export const TokenUrlServer = `${server}/chatkit/authenticate`;

export const InstanceLocator = process.env.REACT_APP_PUSHER_INSTANCE_LOCATOR;