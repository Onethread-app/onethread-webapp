import React, { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { RoomSideBar } from 'layouts/company/room/sidebar/Index';
import { ChatLayout } from 'layouts/company/room/chatLayout/Index';
import { connect } from 'react-redux';
import { IRoomReducer } from 'stores/room/Reducer';
import { isEmpty } from 'lodash';

interface RoomPageComponentProps {
	currentRoom: IRoomReducer['currentRoom'];
}

const RoomPageComponent = (props: RoomPageComponentProps) => {

	const [isOpenLeftSidebar, setIsOpenLeftSidebar] = useState(true);
	const [isOpenRightSidebar, setIsOpenRightSidebar] = useState(true);

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
				<Icon
					className="absolute top-0 pa1 z-3 br2 bg-tigrowLightBlue c-tigrowWhite right--12 pointer"
					icon={isOpenRightSidebar ? 'arrow-right' : 'arrow-left'}
					iconSize={17}
					onClick={() => setIsOpenRightSidebar(!isOpenRightSidebar)} />
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
					<div className="">Right sidebar</div>
				</div>
			)}

		</div >
	);
};

const mapStateToProps = (state: any) => {
	return {
		currentRoom: state.roomReducer.currentRoom,
	};
};

export const RoomPage = connect(mapStateToProps, null)(RoomPageComponent);