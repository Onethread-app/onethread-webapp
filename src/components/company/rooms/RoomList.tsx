import React, { useEffect } from "react";
import { isEqual } from "lodash";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector, connect } from 'react-redux';
import { RoomListItem } from "./RoomListItem";
import { getRoomsAction } from "./../../../stores/room/Actions";
import { Loading } from 'components/common/field/Loading';
import { CURRENT_ROOM, NEW_MESSAGE, GET_ROOM_MESSAGES, GET_ROOMS, CLEAR_ROOM_MESSAGES, ACTIVE_ROOM, ON_PRESENCE_CHANGE } from 'stores/room/Types';
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
	const activeRoom = useSelector((state: any) => state.roomReducer.activeRoom);

	const subscribeToRoom = (roomId: any, name: string) => {
		if (!props.chatkit.isLoading) {
			dispatch({ type: CLEAR_ROOM_MESSAGES });
			dispatch({ type: CURRENT_ROOM, payload: { roomId, name } });
			fetchMessages(roomId);
			props.chatkit.currentUser.subscribeToRoomMultipart({
				roomId: roomId,
				hooks: {
					onMessage: (newMessage: any) => {
						console.log("new-message", newMessage);
						dispatch({ type: NEW_MESSAGE, payload: newMessage });
					},
					onPresenceChanged: (state: any, user: any) => {
						console.log("state", state);
						console.log("user", user);
						dispatch({ type: ON_PRESENCE_CHANGE });
					},
				},
				messageLimit: 1
			})
				.then((room: any) => {
					dispatch({ type: ACTIVE_ROOM, payload: room });
					console.log(room.users);
				})
				.catch((err: any) => { console.log('error on subscribing to room: ', err); subscribeToRoom(roomId, name) })
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
			// dispatch({ type: GET_ROOMS, payload: props.chatkit.currentUser.rooms });
			load(props.getRoomsAction)
		}
	}, [props.chatkit])

	useEffect(() => {
		if (!props.chatkit.isLoading && companyRooms.length) {
			dispatch({ type: CLEAR_ROOM_MESSAGES });
			subscribeToRoom(companyRooms[companyRooms.length - 1]._id, companyRooms[companyRooms.length - 1].name)
		}
	}, [companyRooms])

	return (
		<>
			<main className="mw6 center" id="roomList">
				{props.chatkit.isLoading ? <Loading /> : companyRooms.length ? companyRooms.map((room: { _id: string; name: string; }, i: number, arr: { _id: any; }[]) => {
					return (
						<RoomListItem
							key={room._id}
							roomId={room._id}
							img={room.name[0]}
							name={room.name}
							lastChild={isEqual(room._id, arr[companyRooms.length - 1]._id)}
							active={room._id === roomId ? 'bg-lightest-blue' : ''}
							subscribeToRoom={subscribeToRoom}
						/>
					);
				}) : <p className="ph3">No rooms available for you.</p>}
			</main>
		</>
	);
});

export const RoomList = connect(null, { getRoomsAction })(withRouter(RoomListComponent));