import React from "react";
import { isEqual } from "lodash";
import { RoomListItem } from "./RoomListItem";

interface RoomEntity {
	id: string;
	roomImg: string;
	roomTitle: string;
}
interface RoomListComponentProps {
	rooms: RoomEntity[];
	chatkit?: any;
}

export const RoomList = (
	props: RoomListComponentProps
) => {
	return (
		<>
			<main className="mw6 center" id="roomList">
				{props.rooms.length ? props.rooms.map((room, i, arr) => {
					return (
						<RoomListItem
							key={room.id}
							roomImg={room.roomImg}
							roomTitle={room.roomTitle}
							lastChild={isEqual(room.id, arr[props.rooms.length - 1].id)}
						/>
					);
				}) : <p>You're not assigned into any room.</p>}
			</main>
		</>
	);
};