import React from "react";
import { isEqual } from "lodash";
import { RoomListItem } from "./RoomListItem";
import { Loading } from 'components/common/field/Loading';
const { withChatkit } = require("@pusher/chatkit-client-react");

interface RoomListComponentProps {
	chatkit?: any;
}

export const RoomList = withChatkit((
	props: RoomListComponentProps
) => {
	let rooms = [];
	if (!props.chatkit.isLoading) {
		rooms = props.chatkit.currentUser.rooms;
	}

	return (
		<>
			<main className="mw6 center" id="roomList">
				{props.chatkit.isLoading ? <Loading /> : rooms.length ? rooms.map((room: { id: string; name: string; }, i: number, arr: { id: any; }[]) => {
					return (
						<RoomListItem
							key={room.id}
							img={room.name[0]}
							name={room.name}
							lastChild={isEqual(room.id, arr[rooms.length - 1].id)}
						/>
					);
				}) : <p>You're not assigned into any room.</p>}
			</main>
		</>
	);
})