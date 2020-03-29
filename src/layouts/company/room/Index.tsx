import React, { useState, useEffect } from 'react';
import { Icon } from '@blueprintjs/core';
import { RoomSideBar } from 'layouts/company/room/leftSidebar/Index';
import { ChatLayout } from 'layouts/company/room/chatLayout/Index';
import { connect, useDispatch } from 'react-redux';
import { IRoomReducer, ICompanyRoom, IRoom, IRoomMessage } from 'stores/room/Reducer';
import { isEmpty } from 'lodash';
import { RoomRightSidebar } from './rightSIdebar/Index';
import { UNREAD_COUNT_ROOMS, GET_COMPANY_ROOMS, NEW_MESSAGE, ON_PRESENCE_CHANGE, ON_USER_STARTED_TYPING, ON_USER_STOPPED_TYPING, REFRESH_MEMBER, ACTIVE_ROOM } from 'stores/room/Types';
import {
	getRoomMembers,
	getRoomMessages,
	getRooms,
	getRoomSharedFiles,
	getRoomDiscussions
} from 'stores/room/Actions';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface RoomPageComponentProps {
	currentRoom: IRoomReducer['currentRoom'];
	chatkit?: any;
	companyId: string;
	getRooms: () => void;
	getRoomMembers: (roomId: string) => void;
	getRoomMessages: (roomId: string, limit?: number, skip?: number) => void;
	getRoomSharedFiles: (roomId: string, limit?: number, skip?: number) => void;
	getRoomDiscussions: (roomId: string, limit?: number, skip?: number) => void;
}

const RoomPageComponent = withChatkit((props: RoomPageComponentProps) => {

	const [isOpenLeftSidebar, setIsOpenLeftSidebar] = useState(true);
	const [isOpenRightSidebar, setIsOpenRightSidebar] = useState(true);

	const dispatch = useDispatch();

	const load = async (_getRooms: any) => {
		await _getRooms();
	};

	const subscribeToRoom = async (room: IRoom) => {

		await props.getRoomMessages(room._id);
		await props.getRoomMembers(room._id);
		await props.getRoomSharedFiles(room._id);
		await props.getRoomDiscussions(room._id);

		props.chatkit.currentUser
			.subscribeToRoomMultipart({
				roomId: room._id.toString(),
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
							discussion: content.message.discussion,
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
							payload: { name: user.name, roomId: room._id }
						});
					},
					onUserStoppedTyping: (user: any) => {
						dispatch({
							type: ON_USER_STOPPED_TYPING,
							payload: { name: user.name, roomId: room._id }
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
			.then((pusherRoom: any) => {
				dispatch({ type: ACTIVE_ROOM, payload: pusherRoom });
			})
			.catch((err: any) => {
				subscribeToRoom(room);
			});
	};

	useEffect(() => {
		if (!props.chatkit.isLoading && props.companyId) {
			// connectChatManager();

			load(props.getRooms);

			const roomsUnreadCount = {};
			const companyRooms: ICompanyRoom[] = [];
			props.chatkit.currentUser.rooms
				.filter((room: any) => room.customData.company === props.companyId)
				.forEach((room: any) => {
					roomsUnreadCount[room.id] = room.unreadCount;
					companyRooms.push({
						_id: room.id,
						name: room.name,
						company: room.customData.company,
						project: room.customData.project,
						unreadCount: room.unreadCount,
					});
				});

			dispatch({ type: UNREAD_COUNT_ROOMS, payload: roomsUnreadCount });
			dispatch({ type: GET_COMPANY_ROOMS, payload: companyRooms });
		}
	}, [props.chatkit]);

	useEffect(() => {
		if (!props.chatkit.isLoading && props.currentRoom
			&& !isEmpty(props.currentRoom._id) && !isEmpty(props.currentRoom.name)) {
			subscribeToRoom(props.currentRoom);
		}
	}, [props.chatkit, props.currentRoom]);

	return (
		<div className="flex h-100 w-100">
			<div
				className="overflow-hidden t-25-a bg-white br b--tigrowLightGray-1"
				style={{
					borderBottomLeftRadius: '0.5rem',
					width: isOpenLeftSidebar ? '220px' : '16px'
				}}
			// TODO: mouse active
			// onMouseEnter={() => !isOpenLeftSidebar && setIsOpenLeftSidebar(true)}
			// onMouseLeave={() => isOpenLeftSidebar && setIsOpenLeftSidebar(false)}
			>
				<RoomSideBar
					isOpen={isOpenLeftSidebar}
				/>
			</div>
			<div
				className="relative flex justify-center items-center flex-grow-1"
			>
				<Icon
					className="absolute top-0 pa1 z-3 br2 bg-tigrowLightBlue c-tigrowWhite left--12 pointer"
					icon={isOpenLeftSidebar ? 'arrow-left' : 'arrow-right'}
					iconSize={17}
					onClick={() => setIsOpenLeftSidebar(!isOpenLeftSidebar)} />
				{isEmpty(props.currentRoom.name) === false &&
					isEmpty(props.currentRoom._id) === false &&
					<Icon
						className="absolute top-0 pa1 z-3 br2 bg-tigrowLightBlue c-tigrowWhite right--12 pointer"
						icon={isOpenRightSidebar ? 'arrow-right' : 'arrow-left'}
						iconSize={17}
						onClick={() => setIsOpenRightSidebar(!isOpenRightSidebar)} />}
				<ChatLayout />
			</div>
			{isEmpty(props.currentRoom.name) === false && isEmpty(props.currentRoom._id) === false && (
				<div
					className="overflow-hidden t-25-a bg-white b--tigrowLightGray-1 bl"
					style={{
						borderBottomRightRadius: '0.5rem',
						width: isOpenRightSidebar ? '400px' : '16px'
					}}
				>
					<RoomRightSidebar isOpen={isOpenRightSidebar} />
				</div>
			)}

		</div >
	);
});

const mapStateToProps = (state: any) => {
	return {
		currentRoom: state.roomReducer.currentRoom,
		companyId: state.companyReducer.currentCompany._id,
	};
};

export const RoomPage = connect(mapStateToProps,
	{ getRoomMembers, getRoomMessages, getRooms, getRoomSharedFiles, getRoomDiscussions })(RoomPageComponent);