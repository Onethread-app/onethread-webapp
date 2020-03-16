import { useSelector } from 'react-redux';
import React from 'react';
import { IRoom } from 'stores/room/Reducer';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface RoomListItemProps {
	room: IRoom;
	lastChild: boolean;
	active: boolean;
	subscribeToRoom: (room: IRoom) => void;
	chatkit?: any;
	iconBgColor: string;
}

export const RoomListItem = withChatkit((props: RoomListItemProps) => {
	const unreadCount = useSelector((state: any) => state.roomReducer.roomsUnreadCount[props.room._id]);

	return (
		<li
			id="roomListItem"
			className="pointer br1"
			style={{
				background: props.active ? 'rgb(63, 97, 197)' : '',
				color: props.active ? '#FFFFFF' : ''
			}}
		>
			<article
				onClick={() => {
					if (!props.chatkit.isLoading && !props.active) {
						props.subscribeToRoom(props.room);
					}
				}}
				className={`flex items-center ph2 pv2 bb b--black-10 ${props.lastChild ? 'bn' : ''}`}
			>
				<div className="dn db-ns pr3">
					<span
						className="ttc ba b--black-10 db w1 w2-ns h1 h2-ns br3 tc lh-2 bg-light-gray"
						style={{
							backgroundColor: props.room.archive ? 'rgb(215, 215, 215)' : props.iconBgColor,
							color: '#FFFFFF'
						}}
					>
						{props.room.name[0]}
					</span>
				</div>
				<div className="flex justify-around items-center">
					<h1
						className="f6-ns fw4 mv0 break-word"
						style={{
							color: props.room.archive ? 'rgb(141, 141, 141)' : 'black'
						}}
					>{props.room.name}</h1>
					{unreadCount > 0 ? (
						<h6
							className="bg-tigrowLightBlue white fw8 ma0 ml1"
							style={{
								padding: '4px 8px',
								borderRadius: '50%'
							}}
						>
							{unreadCount}
						</h6>
					) : null}
				</div>
			</article>
		</li >
	);
});
