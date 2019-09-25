import React from "react";
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
			<main className="mw6 center">
				{props.rooms.length ? props.rooms.map(room => {
					return (
						<RoomListItem
							key={room.id}
							roomImg={room.roomImg}
							roomTitle={room.roomTitle}
						/>
					);
				}) : <p>You're not assigned into any room.</p>}
			</main>
		</>
	);
};