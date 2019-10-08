import React, { useState } from "react";
import { Icon } from '@blueprintjs/core';
import { RoomSideBar } from 'components/company/workplace/rooms/RoomSideBar';
import { RightLayout } from 'components/company/workplace/rooms/RightLayout';

export const RoomPage = () => {

	const [isOpen, setIsOpen] = useState(true);
	const [messages, setMessages] = useState([]);
	// const toggleHover = () => {
	// 	setIsOpen(!isOpen);
	// }
	return (
		<div className="flex" style={{ height: 'calc(100vh - 50px)' }}>
			<div
				className={`t-25-a relative bg-white br b--tigrowLightGray-1 ${isOpen ? 'w5' : 'w1'}`}
			// TODO: mouse active
			// onMouseEnter={() => !isOpen && toggleHover()}
			// onMouseLeave={() => isOpen && toggleHover()}
			>
				<Icon
					className={`absolute top-0 mv2 z-3 br-100 bg-tigrowLightBlue c-tigrowWhite right--12`}
					icon={isOpen ? 'circle-arrow-left' : 'circle-arrow-right'}
					iconSize={24}
					onClick={() => setIsOpen(!isOpen)} />
				<RoomSideBar
					isOpen={isOpen}
					messages={messages}
					setMessages={setMessages}
				/>
			</div>
			<div className="w-100 ph3">
				<RightLayout messages={messages} />
			</div>
		</div >
	);
};