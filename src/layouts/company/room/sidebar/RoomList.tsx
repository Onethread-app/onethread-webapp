import React, { useEffect } from "react";
import { isEqual } from "lodash";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useDispatch, useSelector, connect } from "react-redux";
import { getRoomsAction } from "../../../../stores/room/Actions";
import {
	CURRENT_ROOM,
	NEW_MESSAGE,
	GET_ROOM_MESSAGES,
	GET_ROOMS,
	CLEAR_ROOM_MESSAGES,
	ACTIVE_ROOM,
	ON_PRESENCE_CHANGE,
	UPDATE_ROOM,
	ON_USER_STARTED_TYPING,
	ON_USER_STOPPED_TYPING,
	REFRESH_MEMBER
} from "stores/room/Types";
import { Loading } from "components/Loading";
import { RoomListItem } from "./RoomListItem";
const { withChatkit } = require("@pusher/chatkit-client-react");

interface RoomListComponentProps extends RouteComponentProps {
	chatkit?: any;
	getRoomsAction: () => void;
	activeRoom: any;
}

export const RoomListComponent = withChatkit(
	(props: RoomListComponentProps) => {
		const dispatch = useDispatch();

		const roomId = useSelector((state: any) => state.roomReducer.roomId);
		const rooms = useSelector((state: any) => state.roomReducer.rooms);
		const companyId = useSelector(
			(state: any) => state.companyReducer.currentCompany._id
		);

		// const load = async (getRoomsAction: () => void) => {
		// 	await getRoomsAction();
		// 	if (!props.chatkit.isLoading && companyId) {
		// 		// filteredRooms
		// 		const rooms = props.chatkit.currentUser.rooms.filter(
		// 			(room: any) => room.customData.company === companyId
		// 		);
		// 		dispatch({ type: GET_ROOMS, payload: rooms });
		// 	}
		// };

		const subscribeToRoom = (roomId: string, name: string) => {
			if (!props.chatkit.isLoading) {
				dispatch({ type: CLEAR_ROOM_MESSAGES });
				dispatch({ type: CURRENT_ROOM, payload: { roomId, name } });
				fetchMessages(roomId);
				props.chatkit.currentUser
					.subscribeToRoomMultipart({
						roomId: roomId.toString(),
						hooks: {
							onMessage: (newMessage: any) => {
								dispatch({ type: NEW_MESSAGE, payload: newMessage });
								return props.chatkit.currentUser.setReadCursor({
									roomId,
									position: newMessage.id
								});
							},
							onPresenceChanged: (state: any, user: any) => {
								dispatch({ type: ON_PRESENCE_CHANGE });
							},
							onUserStartedTyping: (user: any) => {
								dispatch({
									type: ON_USER_STARTED_TYPING,
									payload: { name: user.name, roomId }
								});
							},
							onUserStoppedTyping: (user: any) => {
								dispatch({
									type: ON_USER_STOPPED_TYPING,
									payload: { name: user.name, roomId }
								});
							},
							onUserJoined: (user: any) => {
								// console.log("joined : " + user.name);
								dispatch({ type: REFRESH_MEMBER });
							},
							onUserLeft: (user: any) => {
								// console.log("left : " + user.name);
							}
						},
						messageLimit: 1
					})
					.then((room: any) => {
						dispatch({ type: ACTIVE_ROOM, payload: room });
					})
					.catch((err: any) => {
						console.log("error on subscribing to room: ", err);
						subscribeToRoom(roomId, name);
					});
			}
		};

		const fetchMessages = (roomId: any, limit = 100) => {
			props.chatkit.currentUser
				.fetchMultipartMessages({
					roomId,
					limit
				})
				.then((messages: any) => {
					dispatch({ type: GET_ROOM_MESSAGES, payload: messages });
				});
		};
		const connectChatManager = () => {
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
						console.log("Error on connection", err);
						connectChatManager();
					});
			}
		};
		useEffect(() => {
			if (!props.chatkit.isLoading && companyId) {
				connectChatManager();
				// load(props.getRoomsAction);

				// filteredRooms
				const rooms = props.chatkit.currentUser.rooms.filter(
					(room: any) => room.customData.company === companyId
				);
				dispatch({ type: GET_ROOMS, payload: rooms });

			}
		}, [props.chatkit]);

		// TODO [TEST-1] I have to test typing indicator by removing this block
		// useEffect(() => {
		// 	if (!props.chatkit.isLoading) {
		// 		for (const roomId in props.chatkit.currentUser.roomSubscriptions) {
		// 			if (
		// 				props.chatkit.currentUser.roomSubscriptions.hasOwnProperty(roomId)
		// 			) {
		// 				const room = props.chatkit.currentUser.roomSubscriptions[roomId];
		// 				room.cancel();
		// 				room.connected = false;
		// 			}
		// 		}
		// 	}
		// }, [companyId]);

		return (
			<>
				<main
					className="mw6"
					id="roomList"
				>
					<ul className="list pa0">
						{props.chatkit.isLoading ? (
							<Loading />
						) : rooms.length && (rooms[0] as any).id !== undefined ? (
							rooms.map((room: any, i: number, arr: any) => {
								return (
									<RoomListItem
										key={room.id}
										roomId={room.id}
										img={room.name[0]}
										name={room.name}
										unreadCount={room.unreadCount}
										lastChild={isEqual(room.id, arr[rooms.length - 1].id)}
										active={room.id === roomId ? "bg-lightest-blue" : ""}
										subscribeToRoom={subscribeToRoom}
									/>
								);
							})
						) : (
									<Loading />
								)}
					</ul>
				</main>
			</>
		);
	}
);

export const RoomList = connect(null, { getRoomsAction })(
	withRouter(RoomListComponent)
);
