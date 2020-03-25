import { isEqual } from 'lodash';
import { tokenConfig } from '../UtilsActions';
import {
	CREATE_ROOM_FROM_SERVER,
	CREATE_ROOM_ERROR,
	GET_ROOM_ERROR,
	LOADING_ROOM,
	ADD_MEMBER_IN_ROOM_ERROR,
	ADD_MEMBER_IN_ROOM,
	GET_ROOM_MEMBERS,
	GET_ROOM_MEMBERS_ERROR,
	CLEAR_ROOMS_ERROR,
	SEND_MESSAGE,
	SEND_MESSAGE_ERROR,
	GET_ROOM_MESSAGES,
	GET_ROOM_MESSAGES_ERROR,
	FILE_UPLOAD,
	ALL_MESSAGE_RECEIVED,
	GET_ROOMS,
	ARCHIVE_ROOM_ERROR,
	ARCHIVE_ROOM,
	GET_ROOM_SHARED_FILES,
	GET_ROOM_SHARED_FILES_ERROR,
	GET_ROOM_DISCUSSIONS,
	GET_ROOM_DISCUSSIONS_ERROR,
	SET_ROOM_DISCUSSIONS,
	TOGGLE_ROOM_DISCUSSIONS_ERROR,
	REMOVE_ROOM_DISCUSSIONS
} from './Types';
import { tigrowApi } from 'config';

export const createRoomAction = (roomData: any) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const company = getState().companyReducer.currentCompany._id;
			const project = getState().projectReducer.projectDetails._id;
			dispatch({ type: LOADING_ROOM });
			const response = await tigrowApi.post(`rooms?pid=${project}`, {
				...roomData,
				company,
				project
			}, headers);
			await dispatch({
				type: CREATE_ROOM_FROM_SERVER,
				payload: response.data.room
			});
			return response.status;
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in creation of company');
		}
	} catch (error) {
		if (error.response.status === 409) {
			dispatch({ type: CREATE_ROOM_ERROR, payload: 'Room already exists' });
		} else if (error.response.status === 401) {
			dispatch({ type: CREATE_ROOM_ERROR, payload: 'Unauthorized user' });
		} else if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: CREATE_ROOM_ERROR, payload: 'Network error' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
		return error.response.status;
	}
};

export const getRooms = () => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			dispatch({ type: LOADING_ROOM });
			const response = await tigrowApi.get(
				`rooms/${getState().companyReducer.currentCompany._id}/${getState().projectReducer.projectDetails._id}`,
				headers
			);
			dispatch({ type: GET_ROOMS, payload: response.data.rooms });
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in rooms fetching');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: GET_ROOM_ERROR, payload: 'Network error' });
		} else if (error.response.status === 401) {
			dispatch({ type: GET_ROOM_ERROR, payload: 'Unauthorized user' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const getRoomMembers = (roomId: string) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.get(`rooms/members/${roomId}`, headers);
			dispatch({
				type: GET_ROOM_MEMBERS,
				payload: response.data.members
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in room\'s members fetching');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({
				type: GET_ROOM_MEMBERS_ERROR,
				payload: 'Network error'
			});
		} else if (error.response.status === 401) {
			dispatch({
				type: GET_ROOM_MEMBERS_ERROR,
				payload: 'Unauthorized user'
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const addRoomMembers = (data: {
	room: string;
	members: Array<(string | undefined)>;
}, selectedRoomMember: any) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			dispatch({ type: LOADING_ROOM });
			const response = await tigrowApi.post(`rooms/addUser`, data, headers);
			if (response.status === 201) {
				dispatch({ type: ADD_MEMBER_IN_ROOM, payload: selectedRoomMember });
			}
			return response;
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in adding members in a room');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: ADD_MEMBER_IN_ROOM_ERROR, payload: 'Network error' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
		return error.response;
	}
};

export const clearRoomError = () => async (dispatch: any) => {
	dispatch({ type: CLEAR_ROOMS_ERROR });
};

export const sendRoomMessage = (data: { text: string, room: string, files: any[], type?: string; }) =>
	async (dispatch: any) => {
		try {
			const headers = tokenConfig();
			if ((headers as any).headers.Authorization) {
				const response = await tigrowApi.post(`messages`, data, headers);
				await dispatch({ type: SEND_MESSAGE });
				return response.status;
			} else {
				// tslint:disable-next-line: no-console
				console.log('error in sending a room message');
			}
		} catch (error) {
			if (error.response.status === 401) {
				dispatch({ type: SEND_MESSAGE_ERROR, payload: 'Unauthorized user' });
			} else if (isEqual(error.message, 'Network Error')) {
				dispatch({ type: SEND_MESSAGE_ERROR, payload: 'Network error' });
			} else {
				// tslint:disable-next-line: no-console
				console.log(error.response);
			}
			return error.response.status;
		}
	};

export const getRoomMessages = (roomId: string, limit: number = 15, skip: number = 0) => async (
	dispatch: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.get(`messages/room/${roomId}?limit=${limit}&skip=${skip}`, headers);
			if (response.data.count < limit) {
				dispatch({ type: ALL_MESSAGE_RECEIVED, payload: true });
			}
			dispatch({
				type: GET_ROOM_MESSAGES,
				payload: response.data.messages.reverse()
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in room\'s message fetching');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({
				type: GET_ROOM_MESSAGES_ERROR,
				payload: 'Network error'
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const fileUploadAction = (imageSelected: any, roomID: string) => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(`files/file-upload-room?roomID=${roomID}`, imageSelected, headers);
			dispatch({ type: FILE_UPLOAD, payload: response.data.newFile });
			return response;
		} else {
			// tslint:disable-next-line: no-console
			console.log('no headers');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			// tslint:disable-next-line: no-console
			console.log('network error');
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
		return error.response;
	}
};

export const archiveRoom = (data: { archive: boolean; }, roomId: string) => async (
	dispatch: any,
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.put(`rooms/${roomId}/archive`, data, headers);
			await dispatch({
				type: ARCHIVE_ROOM,
				payload: {
					roomId,
					archive: data.archive
				}
			});
			return response.status;
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in creation of company');
		}
	} catch (error) {
		if (error.response.status === 401) {
			dispatch({ type: ARCHIVE_ROOM_ERROR, payload: 'Unauthorized user' });
		} else if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: ARCHIVE_ROOM_ERROR, payload: 'Network error' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
		return error.response.status;
	}
};

export const getRoomSharedFiles = (roomId: string, limit: number = 1000, skip: number = 0) => async (
	dispatch: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.get(`messages/room/${roomId}/files?limit=${limit}&skip=${skip}`, headers);
			// if (response.data.count < limit) {
			// 	dispatch({ type: ALL_MESSAGE_RECEIVED, payload: true });
			// }
			dispatch({
				type: GET_ROOM_SHARED_FILES,
				payload: response.data.files
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in room\'s file fetching');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({
				type: GET_ROOM_SHARED_FILES_ERROR,
				payload: 'Network error'
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const getRoomDiscussions = (roomId: string, limit: number = 1000, skip: number = 0) => async (dispatch: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.get(`messages/room/${roomId}/discussion?limit=${limit}&skip=${skip}`, headers);
			// if (response.data.count < limit) {
			// 	dispatch({ type: ALL_MESSAGE_RECEIVED, payload: true });
			// }
			dispatch({
				type: GET_ROOM_DISCUSSIONS,
				payload: response.data.discussion
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in room\'s discussion fetching');
		}
	} catch (error) {
		if (isEqual(error.message, 'Network Error')) {
			dispatch({
				type: GET_ROOM_DISCUSSIONS_ERROR,
				payload: 'Network error'
			});
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
	}
};

export const toggleDiscussionRoom = (data: { discussion: boolean; }, messageId: string) => async (
	dispatch: any,
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.put(`messages/${messageId}/discussion`, data, headers);
			await dispatch({
				type: response.data.discussion.discussion ?
					SET_ROOM_DISCUSSIONS : REMOVE_ROOM_DISCUSSIONS,
				payload: {
					data: {
						_id: response.data.discussion._id,
						text: response.data.discussion.text,
						room: response.data.discussion.room,
						chatkitId: response.data.discussion.chatkitId,
						createdAt: response.data.discussion.createdAt,
						updatedAt: response.data.discussion.updatedAt
					},
					discussion: response.data.discussion.discussion
				}
			});
			return response.status;
		} else {
			// tslint:disable-next-line: no-console
			console.log('error in creation of company');
		}
	} catch (error) {
		if (error.response.status === 401) {
			dispatch({ type: TOGGLE_ROOM_DISCUSSIONS_ERROR, payload: 'Unauthorized user' });
		} else if (isEqual(error.message, 'Network Error')) {
			dispatch({ type: TOGGLE_ROOM_DISCUSSIONS_ERROR, payload: 'Network error' });
		} else {
			// tslint:disable-next-line: no-console
			console.log(error.response);
		}
		return error.response.status;
	}
};