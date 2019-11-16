import React, { useEffect } from "react";
import { isEqual } from "lodash";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector, connect } from 'react-redux';
import { RoomListItem } from "./RoomListItem";
import { getRoomsAction } from "./../../../stores/room/Actions";
import { CURRENT_ROOM, NEW_MESSAGE, GET_ROOM_MESSAGES, GET_ROOMS, CLEAR_ROOM_MESSAGES, ACTIVE_ROOM, ON_PRESENCE_CHANGE, UPDATE_ROOM, ON_USER_STARTED_TYPING, ON_USER_STOPPED_TYPING } from 'stores/room/Types';
const { withChatkit } = require("@pusher/chatkit-client-react");

const load = async (
	getRoomsAction: () => void,
) => {
	await getRoomsAction();
}

interface RoomListComponentProps extends RouteComponentProps {
	chatkit?: any;
	getRoomsAction: () => void;
	activeRoom: any;
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
						dispatch({ type: NEW_MESSAGE, payload: newMessage });
						return props.chatkit.currentUser.setReadCursor({
							roomId,
							position: newMessage.id,
						});
					},
					onPresenceChanged: (state: any, user: any) => {
						dispatch({ type: ON_PRESENCE_CHANGE });
					},
					onUserStartedTyping: (user: any) => {
						dispatch({ type: ON_USER_STARTED_TYPING, payload: user.name });
					},
					onUserStoppedTyping: (user: any) => {
						dispatch({ type: ON_USER_STOPPED_TYPING, payload: user.name });
					},
					onUserJoined: (user: any) => {
						console.log("joined : " + user.name);
					},
					onUserLeft: (user: any) => {
						console.log("left : " + user.name);
					}
				},
				messageLimit: 1
			})
				.then((room: any) => {
					dispatch({ type: ACTIVE_ROOM, payload: room });
				})
				.catch((err: any) => { console.log('error on subscribing to room: ', err); subscribeToRoom(roomId, name); })
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
						dispatch({ type: UPDATE_ROOM, payload: room });
					}
				})
				.then((currentUser: any) => {
					// console.log('Successful connection', currentUser)
				})
				.catch((err: any) => {
					console.log('Error on connection', err)
				})
			load(props.getRoomsAction)
		}
	}, [props.chatkit])

	useEffect(() => {
		if (!props.chatkit.isLoading && companyRooms.length) {
			filteredRooms();
		}
	}, [companyRooms])

	const filteredRooms = () => {
		let rooms = props.chatkit.currentUser.rooms.filter((a: any) => {
			return companyRooms.some((b: any) => {
				return b._id === a.id;
			});
		});
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