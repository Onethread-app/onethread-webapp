import React, { useState, useEffect } from "react";
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
	const [roomId, setRoomId] = useState(null);
	const [rooms, setRooms] = useState([]);
	const [messages, setMessages] = useState([{}]);

	const fetchMessages = (roomId: any, limit = 10) => {
		props.chatkit.currentUser.fetchMessages(
			{
				roomId,
				limit,
			})
			.then((messages: any) => {
				// let fetchedMessage = messages.find(message => message.id == newMessage.id);
				// setMessages()
				console.log("recieved message :", messages);
			});
	}

	const subscribeToRoom = (roomId: any) => {
		if (!props.chatkit.isLoading) {
			// setMessages([]);
			props.chatkit.currentUser.subscribeToRoom({
				roomId: roomId,
				hooks: {
					onNewMessage: (message: {}) => {
						console.log("message", message);
						setMessages([...messages, message])
					}
				}, messageLimit: 10
			})
				.then((room: any) => {
					setRoomId(room.id);
					setRooms(props.chatkit.currentUser.rooms);
					console.log(room);

					// TODO: will start from here!!
					fetchMessages(room.id);
				})
				.catch((err: any) => console.log('error on subscribing to room: ', err))
		}
	}

	useEffect(() => {
		if (!props.chatkit.isLoading) {
			setRooms(props.chatkit.currentUser.rooms);
			console.log("rooms", rooms);
			console.log("room", roomId);
			console.log("messages", messages);
		}
	}, [props.chatkit])

	useEffect(() => {
		if (!props.chatkit.isLoading && rooms.length > 0) {

			console.log("room", roomId);
			console.log("messages", messages);
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
						/>
					);
				}) : <p>You're not assigned into any room.</p>}
			</main>
		</>
	);
})