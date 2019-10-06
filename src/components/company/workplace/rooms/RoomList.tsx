import React, { useState, useEffect } from "react";
import { isEqual } from "lodash";
import { RoomListItem } from "./RoomListItem";
import { Loading } from 'components/common/field/Loading';
const { withChatkit } = require("@pusher/chatkit-client-react");

interface RoomListComponentProps {
	chatkit?: any;
	setMessages: (messages: any) => void;
	messages: [{}]
}

export const RoomList = withChatkit((
	props: RoomListComponentProps
) => {
	const [roomId, setRoomId] = useState(null);
	const [rooms, setRooms] = useState([]);

	const fetchMessages = (roomId: any, limit = 10) => {
		props.chatkit.currentUser.fetchMessages(
			{
				roomId,
				limit,
			})
			.then((messages: any) => {
				console.log("received message :", messages);
				props.setMessages(messages)
			});
	}

	const subscribeToRoom = (roomId: any) => {
		if (!props.chatkit.isLoading) {
			setRoomId(roomId);
			// props.setMessages([]);
			props.chatkit.currentUser.subscribeToRoomMultipart({
				roomId: roomId,
				hooks: {
					onMessage: (newMessage: any) => {
						console.log("newMessage", newMessage);
						const {
							id,
							createdAt,
							senderId,
						} = newMessage;
						let msg = {
							id,
							text: newMessage.parts[0].payload.content,
							createdAt,
							sender: newMessage.userStore.users[newMessage.senderId],
							senderId,
							userStore: {
								users: { senderId: newMessage.userStore.users[newMessage.senderId] }
							}
						};
						msg.userStore.users[senderId] = newMessage.userStore.users[newMessage.senderId];
						console.log("format-message", msg);
						console.log("props.messages", props.messages);

						// props.setMessages([...props.messages, msg]);
					}
				},
				messageLimit: 1
			})
				.then((room: any) => {

					console.log("current-room", room);

					// TODO: will start from here!!
					fetchMessages(room.id);
				})
				.catch((err: any) => console.log('error on subscribing to room: ', err))
		}
	}

	useEffect(() => {
		if (!props.chatkit.isLoading) {
			setRooms(props.chatkit.currentUser.rooms);
			if (props.chatkit.currentUser.rooms.length > 0) {
				props.setMessages([]);
				subscribeToRoom(props.chatkit.currentUser.rooms[0].id)
			}
		}
	}, [props.chatkit])

	useEffect(() => {
		if (!props.chatkit.isLoading && rooms.length > 0) {
			console.log("room", roomId);
		}
	}, [roomId])

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
							setMessages={props.setMessages}
						/>
					);
				}) : <p>No rooms available for you.</p>}
			</main>
		</>
	);
})