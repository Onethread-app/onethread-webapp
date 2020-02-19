import React, { useEffect } from 'react';
import { isEqual } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';
import { getRoomMembers, getRoomMessages } from '../../../../stores/room/Actions';
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
	activeRoom: any;
	roomId: string;
	rooms: IRoom[];
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

		useEffect(() => {
			if (!props.chatkit.isLoading && props.companyId) {
				connectChatManager();

				// filteredRooms
				// tslint:disable-next-line: no-shadowed-variable
				const rooms = props.chatkit.currentUser.rooms
					.filter((room: any) => room.customData.company === props.companyId)
					.map((room: any) => ({
						id: room.id,
						name: room.name,
						unreadCount: room.unreadCount,
						company: room.customData.company,
						createdByUserId: room.createdByUserId,
						createdAt: room.createdAt,
						updatedAt: room.updatedAt
					}));

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
										key={room.id}
										roomId={room.id}
										img={room.name[0]}
										name={room.name}
										unreadCount={room.unreadCount}
										lastChild={isEqual(room.id, arr[props.rooms.length - 1].id)}
										active={room.id === props.roomId}
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
		companyId: state.companyReducer.currentCompany._id
	};
};

export const RoomList = connect(mapStateToProps, { getRoomMembers, getRoomMessages })(
	withRouter(RoomListComponent)
);
