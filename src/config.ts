import decode from 'jwt-decode';
import axios from 'axios';

export const test = 'https://test.tigrow.co/api/v1/';
export const prod = 'https://betaback.tigrow.co/api/v1/';
// export const server = process.env.NODE_ENV === 'production' ? prod : dev;
export const server = test;

const token: string | null = localStorage.hasOwnProperty('tigrow_acc_id') ? localStorage.getItem('tigrow_acc_id') : '';

export const UserId = localStorage.getItem('tigrow_acc_id') ? token ? (decode(token) as any)._id : '' : '';

export const TokenUrlServer = `${server}chatkit/authenticate`;

export const InstanceLocator = process.env.REACT_APP_PUSHER_INSTANCE_LOCATOR;

export const tigrowApi = axios.create({
	baseURL: server
});