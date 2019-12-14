import tigrowApi from "tigrowApi";
import { isEqual } from "lodash";
import { tokenConfig } from "../UtilsActions";
import {
	CREATE_ROOM_FROM_SERVER,
	CREATE_ROOM_ERROR,
	GET_ROOMS_FROM_SERVER,
	GET_ROOM_ERROR,
	LOADING_ROOM,
	ADD_MEMBER_IN_ROOM_ERROR,
	ADD_MEMBER_IN_ROOM,
	GET_ROOM_MEMBERS_FROM_SERVER,
	GET_ROOM_MEMBERS_FROM_SERVER_ERROR,
	CLEAR_ROOMS_ERROR,
	SEND_MESSAGE,
	SEND_MESSAGE_ERROR
} from "./Types";

export const createRoomAction = (roomData: any) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			roomData.company = getState().companyReducer.currentCompany._id;
			dispatch({ type: LOADING_ROOM });
			const response = await tigrowApi.post(`/rooms`, roomData, headers);
			await dispatch({
				type: CREATE_ROOM_FROM_SERVER,
				payload: response.data.room
			});
			return response.status;
		} else {
			console.log("error in creation of company");
		}
	} catch (error) {
		if (error.response.status === 409) {
			dispatch({ type: CREATE_ROOM_ERROR, payload: "Room already exists" });
		} else if (error.response.status === 401) {
			dispatch({ type: CREATE_ROOM_ERROR, payload: "Unauthorized user" });
		} else if (isEqual(error.message, "Network Error")) {
			dispatch({ type: CREATE_ROOM_ERROR, payload: "Network error" });
		} else {
			console.log(error.response);
		}
		return error.response.status;
	}
};

export const getRoomsAction = () => async (dispatch: any, getState: any) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			dispatch({ type: LOADING_ROOM });
			const response = await tigrowApi.get(
				`/rooms/${getState().companyReducer.currentCompany._id}`,
				headers
			);
			dispatch({ type: GET_ROOMS_FROM_SERVER, payload: response.data.rooms });
		} else {
			console.log("error in rooms fetching");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({ type: GET_ROOM_ERROR, payload: "Network error" });
		} else if (error.response.status === 401) {
			dispatch({ type: GET_ROOM_ERROR, payload: "Unauthorized user" });
		} else {
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
			dispatch({ type: LOADING_ROOM });
			const response = await tigrowApi.get(`/rooms/members/${roomId}`, headers);
			dispatch({
				type: GET_ROOM_MEMBERS_FROM_SERVER,
				payload: response.data.members
			});
		} else {
			console.log("error in room's members fetching");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({
				type: GET_ROOM_MEMBERS_FROM_SERVER_ERROR,
				payload: "Network error"
			});
		} else if (error.response.status === 401) {
			dispatch({
				type: GET_ROOM_MEMBERS_FROM_SERVER_ERROR,
				payload: "Unauthorized user"
			});
		} else {
			console.log(error.response);
		}
	}
};

export const addRoomMembers = (members: any, selectedRoomMember: any) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			dispatch({ type: LOADING_ROOM });
			await tigrowApi.post(`/rooms/addUser`, members, headers);
			dispatch({ type: ADD_MEMBER_IN_ROOM, payload: selectedRoomMember });
		} else {
			console.log("error in adding members in a room");
		}
	} catch (error) {
		if (isEqual(error.message, "Network Error")) {
			dispatch({ type: ADD_MEMBER_IN_ROOM_ERROR, payload: "Network error" });
		} else {
			console.log(error.response);
		}
	}
};

export const clearRoomError = () => async (dispatch: any) => {
	dispatch({ type: CLEAR_ROOMS_ERROR });
};

export const sendRoomMessage = (data: { text: string, room: string, type?: string }) => async (
	dispatch: any,
	getState: any
) => {
	try {
		const headers = tokenConfig();
		if ((headers as any).headers.Authorization) {
			const response = await tigrowApi.post(`/messages`, data, headers);
			await dispatch({ type: SEND_MESSAGE });
			return response.status;
		} else {
			console.log("error in sending a room message");
		}
	} catch (error) {
		if (error.response.status === 401) {
			dispatch({ type: SEND_MESSAGE_ERROR, payload: "Unauthorized user" });
		} else if (isEqual(error.message, "Network Error")) {
			dispatch({ type: SEND_MESSAGE_ERROR, payload: "Network error" });
		} else {
			console.log(error.response);
		}
		return error.response.status;
	}
};