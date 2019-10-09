import React, { useEffect } from "react";
import { isEqual } from "lodash";
import { RoomListItem } from "./RoomListItem";
import { Loading } from 'components/common/field/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ROOM_MESSAGES, CLEAR_ROOM_MESSAGES, GET_ROOMS, CURRENT_ROOM, NEW_MESSAGE } from 'actions/Types';
const { withChatkit } = require("@pusher/chatkit-client-react");

interface RoomListComponentProps {
	chatkit?: any;
}

export const RoomList = withChatkit((
	props: RoomListComponentProps
) => {

	const dispatch = useDispatch();
	const messages = useSelector((state: any) => state.roomReducer.messages);
	const rooms = useSelector((state: any) => state.roomReducer.rooms);
	const roomId = useSelector((state: any) => state.roomReducer.roomId);

	const subscribeToRoom = (roomId: any) => {
		if (!props.chatkit.isLoading) {
			dispatch({ type: CURRENT_ROOM, payload: roomId });
			props.chatkit.currentUser.subscribeToRoomMultipart({
				roomId: roomId,
				hooks: {
					onMessage: (newMessage: any) => {
						const {
							id,
							createdAt,
							senderId,
						} = newMessage;
						let message = {
							id,
							text: newMessage.parts[0].payload.content,
							createdAt,
							senderId,
							userStore: {
								users: { senderId: newMessage.userStore.users[newMessage.senderId] }
							}
						};
						message.userStore.users[senderId] = newMessage.userStore.users[newMessage.senderId];

						if (!messages[0].id) {
							dispatch({ type: NEW_MESSAGE, payload: message });
						}
					}
				},
				messageLimit: 1
			})
				.then((room: any) => {
					fetchMessages(room.id);
				})
				.catch((err: any) => console.log('error on subscribing to room: ', err))
		}
	}

	const fetchMessages = (roomId: any, limit = 100) => {
		props.chatkit.currentUser.fetchMessages(
			{
				roomId,
				limit,
			})
			.then((messages: any) => {
				dispatch({ type: GET_ROOM_MESSAGES, payload: messages });
			});
	}

	useEffect(() => {
		if (!props.chatkit.isLoading) {
			dispatch({ type: GET_ROOMS, payload: props.chatkit.currentUser.rooms });
			if (props.chatkit.currentUser.rooms.length > 0) {
				dispatch({ type: CLEAR_ROOM_MESSAGES });
				subscribeToRoom(props.chatkit.currentUser.rooms[0].id)
			}
		}
	}, [props.chatkit])

	return (
		<>
			<main className="mw6 center" id="roomList">
				{props.chatkit.isLoading ? <Loading /> : rooms.length ? rooms.map((room: { id: string; name: string; }, i: number, arr: { id: any; }[]) => {
					return (
						<RoomListItem
							key={room.id}
							roomId={room.id}
							img={room.name[0]}
							name={room.name}
							lastChild={isEqual(room.id, arr[rooms.length - 1].id)}
							active={room.id === roomId ? 'bg-lightest-blue' : ''}
							subscribeToRoom={subscribeToRoom}
						/>
					);
				}) : <p>No rooms available for you.</p>}
			</main>
		</>
	);
});