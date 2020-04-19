import React from 'react';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';

import { Loading } from 'components/Loading';
import { RoomListItem } from './RoomListItem';
import { IRoom, IRoomReducer } from 'stores/room/Reducer';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface IRoomListComponentProps {
	chatkit?: any;
	currentRoom: IRoomReducer['currentRoom'];
	rooms: IRoom[];
}

export const RoomListComponent = withChatkit(
	(props: IRoomListComponentProps) => {

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
										room={room}
										lastChild={isEqual(room._id, arr[props.rooms.length - 1].id)}
										active={room._id === props.currentRoom._id}
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
		currentRoom: state.roomReducer.currentRoom,
		rooms: state.roomReducer.rooms,
	};
};

export const RoomList = connect(mapStateToProps, null)(RoomListComponent);
