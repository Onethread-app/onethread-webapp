import React, { useEffect } from 'react';
import { isEqual } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';
import { getRoomMembers, getRoomMessages, getRooms } from '../../../../stores/room/Actions';
import {
	CURRENT_ROOM,
	NEW_MESSAGE,
	GET_ROOMS,
	CLEAR_ROOM_MESSAGES,
	ACTIVE_ROOM,
	ON_PRESENCE_CHANGE,
	UPDATE_ROOM,
	ON_USER_STARTED_TYPING,
	ON_USER_STOPPED_TYPING,
	REFRESH_MEMBER,
	UNREAD_COUNT_ROOMS,
} from 'stores/room/Types';
import { Loading } from 'components/Loading';
import { RoomListItem } from './RoomListItem';
import { IRoom, IRoomMessage } from 'stores/room/Reducer';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface IRoomListComponentProps extends RouteComponentProps {
	chatkit?: any;
	getRoomMembers: (roomId: string) => void;
	getRoomMessages: (roomId: string, limit?: number, skip?: number) => void;
	getRooms: () => void;
	activeRoom: any;
	roomId: string;
	rooms: IRoom[];
	companyRooms: IRoom[];
	roomsUnreadCount: any;
	companyId: string;
}

export const RoomListComponent = withChatkit(
	(props: IRoomListComponentProps) => {
		const dispatch = useDispatch();

		// tslint:disable-next-line: no-shadowed-variable
		const subscribeToRoom = async (roomId: string, name: string) => {
			if (!props.chatkit.isLoading) {
				dispatch({ type: CLEAR_ROOM_MESSAGES });
				dispatch({ type: CURRENT_ROOM, payload: { roomId, name } });

				await props.getRoomMessages(roomId);
				await props.getRoomMembers(roomId);

				props.chatkit.currentUser
					.subscribeToRoomMultipart({
						roomId: roomId.toString(),
						hooks: {
							onMessage: (newMessage: any) => {
								const content = JSON.parse(newMessage.parts[0].payload.content);

								const formatMessage: IRoomMessage = {
									type: content.message.type,
									files: content.files,
									removed: content.message.removed,
									_id: content.message._id,
									text: content.message.text,
									room: content.message.room,
									account: content.account,
									chatkitId: newMessage.id,
									createdAt: newMessage.createdAt,
									updatedAt: newMessage.updatedAt,
								};

								dispatch({ type: NEW_MESSAGE, payload: formatMessage });
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
						subscribeToRoom(roomId, name);
					});
			}
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
						connectChatManager();
					});
			}
		};

		const load = async (_getRooms: any) => {
			await _getRooms();
		};

		useEffect(() => {
			if (!props.chatkit.isLoading && props.companyId) {
				connectChatManager();

				load(props.getRooms);

				const roomsUnreadCount = {};
				props.chatkit.currentUser.rooms
					.filter((room: any) => room.customData.company === props.companyId)
					.forEach((room: any) => {
						roomsUnreadCount[room.id] = room.unreadCount;
					});

				dispatch({ type: UNREAD_COUNT_ROOMS, payload: roomsUnreadCount });
			}
		}, [props.chatkit]);

		const roomBgColor = ['#D8315B', '#9F7DE8', '#0FA3A3', '#456990', '#CDA2AB', '#FE5E41'];

		return (
			<>
				<main
					className="mw6"
					id="roomList"
				>
					<ul className="list pa0 mh2">
						{props.chatkit.isLoading ? (
							<Loading />
						) : props.rooms.length ? (
							props.rooms.map((room: IRoom, i: number, arr: any) => {
								return (
									<RoomListItem
										key={room._id}
										id={room._id}
										img={room.name[0]}
										name={room.name}
										lastChild={isEqual(room._id, arr[props.rooms.length - 1].id)}
										active={room._id === props.roomId}
										subscribeToRoom={subscribeToRoom}
										iconBgColor={roomBgColor[i % roomBgColor.length]}
									/>
								);
							})
						) : (<p className="ph2">No rooms</p>)}
					</ul>
				</main>
			</>
		);
	}
);

const mapStateToProps = (state: any) => {
	return {
		roomId: state.roomReducer.roomId,
		rooms: state.roomReducer.rooms,
		companyRooms: state.roomReducer.companyRooms,
		roomsUnreadCount: state.roomReducer.roomsUnreadCount,
		companyId: state.companyReducer.currentCompany._id
	};
};

export const RoomList = connect(mapStateToProps, { getRoomMembers, getRoomMessages, getRooms })(
	withRouter(RoomListComponent)
);
