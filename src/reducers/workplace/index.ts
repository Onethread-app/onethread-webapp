import { combineReducers } from "redux";
import { RoomReducer } from "./RoomReducer";

export const WorkplaceReducer = combineReducers({
	room: RoomReducer
});
