import {
	LOADING_ROOM,
	GET_ROOMS,
	CURRENT_ROOM,
	GET_ROOM_MESSAGES,
	SEND_MESSAGE
} from "./Types";
import { isEqual } from "lodash";

export const fetchRoomsMessage = (messages: any) => async (dispatch: any, getState: any) => {

	dispatch({ type: LOADING_ROOM });
	dispatch({ type: GET_ROOM_MESSAGES, payload: messages });

};