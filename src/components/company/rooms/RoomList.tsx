import React, { useEffect, useState } from "react";
import { isEqual } from "lodash";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector, connect } from 'react-redux';
import { RoomListItem } from "./RoomListItem";
import { getRoomsAction } from "./../../../stores/room/Actions";
import { Loading } from 'components/common/field/Loading';
import { CURRENT_ROOM, NEW_MESSAGE, GET_ROOM_MESSAGES, GET_ROOMS, CLEAR_ROOM_MESSAGES, ACTIVE_ROOM, ON_PRESENCE_CHANGE, UPDATE_ROOM } from 'stores/room/Types';
import { async } from 'q';
const { withChatkit } = require("@pusher/chatkit-client-react");

const load = async (
	getRoomsAction: () => void,
) => {
	await getRoomsAction();
}

interface RoomListComponentProps extends RouteComponentProps {
	chatkit?: any;
	getRoomsAction: () => void
}

export const RoomListComponent = withChatkit((
	props: RoomListComponentProps
) => {

	const dispatch = useDispatch();

	const companyRooms = useSelector((state: any) => state.roomReducer.companyRooms);
	const roomId = useSelector((state: any) => state.roomReducer.roomId);
	const rooms = useSelector((state: any) => state.roomReducer.rooms);

	const subscribeToRoom = (roomId: string, name: string) => {
		if (!props.chatkit.isLoading) {
			dispatch({ type: CLEAR_ROOM_MESSAGES });
			dispatch({ type: CURRENT_ROOM, payload: { roomId, name } });
			fetchMessages(roomId);
			props.chatkit.currentUser.subscribeToRoomMultipart({
				roomId: roomId.toString(),
				hooks: {
					onMessage: (newMessage: any) => {
						// console.log("new-message", newMessage);
						dispatch({ type: NEW_MESSAGE, payload: newMessage });
					},
					onPresenceChanged: (state: any, user: any) => {
						// console.log("state", state);
						// console.log("user", user);
						dispatch({ type: ON_PRESENCE_CHANGE });
					},
				},
				messageLimit: 1
			})
				.then((room: any) => {
					dispatch({ type: ACTIVE_ROOM, payload: room });
				})
				.catch((err: any) =>
					console.log('error on subscribing to room: ', err))
		}
	}

	const fetchMessages = (roomId: any, limit = 100) => {
		props.chatkit.currentUser.fetchMultipartMessages(
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
			props.chatkit.chatManager
				.connect({
					onRoomUpdated: (room: any) => {
						console.log("room", room);
						dispatch({ type: UPDATE_ROOM, payload: room });
					}
				})
				.then((currentUser: any) => {
					console.log('Successful connection', currentUser)
				})
				.catch((err: any) => {
					console.log('Error on connection', err)
				})


			load(props.getRoomsAction)
		}
	}, [props.chatkit])

	useEffect(() => {
		if (!props.chatkit.isLoading && companyRooms.length) {
			// dispatch({ type: CLEAR_ROOM_MESSAGES });
			// subscribeToRoom(companyRooms[companyRooms.length - 1]._id, companyRooms[companyRooms.length - 1].name);
			filteredRooms();
		}
	}, [companyRooms])

	const filteredRooms = () => {
		let rooms = props.chatkit.currentUser.rooms.filter((a: any) => {
			return companyRooms.some((b: any) => {
				return b._id === a.id;
			});
		});
		// console.log(rooms);
		dispatch({ type: GET_ROOMS, payload: rooms });
	}

	const updateRooms = (room: any) => {
		console.log("rooms.length", rooms.length);
		const index = rooms.findIndex((r: any) => r.id === room.id);
		rooms[index] = room;
		dispatch({ type: GET_ROOMS, payload: rooms });
	}

	return (
		<>
			<main className="mw6 center" id="roomList">
				{props.chatkit.isLoading ? "" : rooms.length && (rooms[0] as any).id !== undefined ? rooms.map((room: any, i: number, arr: any) => {
					return (
						<RoomListItem
							key={room.id}
							roomId={room.id}
							img={room.name[0]}
							name={room.name}
							unreadCount={room.unreadCount}
							lastChild={isEqual(room.id, arr[rooms.length - 1].id)}
							active={room.id === roomId ? 'bg-lightest-blue' : ''}
							subscribeToRoom={subscribeToRoom}
						/>
					);
				}) : <p className="ph3">No rooms available for you.</p>}
			</main>
		</>
	);
});

export const RoomList = connect(null, { getRoomsAction })(withRouter(RoomListComponent));