import { CHATKIT_USER_LOADING, GET_CHATKIT_USER, GET_CHATKIT_USER_ERROR } from 'actions/Types';
import { isAuthenticate } from "actions/UtilsActions";

const chatKitClient = require('@pusher/chatkit-client');


export const initializeChatkitAction = (
) => async (dispatch: any, getState: any) => {

	if (isAuthenticate()) {
		dispatch({ type: CHATKIT_USER_LOADING });
		console.log('user-id', getState().auth.user._id);
		const chatManager = new chatKitClient.ChatManager({
			instanceLocator: 'v1:us1:8f737fc2-ce0a-4e83-952d-0081becf93c5',
			userId: getState().auth.user._id,
			tokenProvider: new chatKitClient.TokenProvider({ url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/8f737fc2-ce0a-4e83-952d-0081becf93c5/token' })
		});

		chatManager.connect()
			.then((currentUser: any) => {
				dispatch({ type: GET_CHATKIT_USER, payload: currentUser });
			})
			.catch((err: any) => {
				dispatch({ type: GET_CHATKIT_USER_ERROR, payload: "Empty chatKit user" });
				console.log('Error on connection', err)
			})
	}


};