import React, { useState } from "react";
import { Icon } from '@blueprintjs/core';
import { RoomSideBar } from 'components/company/rooms/RoomSideBar';
import { ChatLayout } from 'components/company/rooms/chats/ChatLayout';

export const RoomPage = () => {

	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="flex h-100">
			<div
				className={`t-25-a bg-white br b--tigrowLightGray-1 ${isOpen ? 'w5' : 'w1'}`}
			// TODO: mouse active
			// onMouseEnter={() => !isOpen && setIsOpen(true)}
			// onMouseLeave={() => isOpen && setIsOpen(false)}
			>

				<RoomSideBar
					isOpen={isOpen}
				/>
			</div>
			<div className="w-100 relative">
				<Icon
					className={`absolute top-0 mv2 z-3 br-100 bg-tigrowLightBlue c-tigrowWhite left--12`}
					icon={isOpen ? 'circle-arrow-left' : 'circle-arrow-right'}
					iconSize={24}
					onClick={() => setIsOpen(!isOpen)} />
				<ChatLayout />
			</div>
		</div >
	);
};