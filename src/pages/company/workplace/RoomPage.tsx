import React, { useState } from "react";
import { Icon } from '@blueprintjs/core';
import { SideBarLeft } from 'components/company/workplace/rooms/SideBarLeft';
import { ChatLayout } from 'components/company/workplace/rooms/ChatLayout';

export const RoomPage = () => {

	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="flex" style={{ height: 'calc(100vh - 50px)' }}>
			<div
				className={`t-25-a relative bg-white br b--tigrowLightGray-1 ${isOpen ? 'w-20' : 'w-2'}`}>
				<Icon
					className={`absolute top-0 mv2 z-3 br-100 bg-tigrowDarkBlue c-tigrowWhite ${isOpen ? 'right--8' : 'left--8'}`}
					icon={isOpen ? 'double-chevron-left' : 'double-chevron-right'}
					onClick={() => setIsOpen(!isOpen)} />
				<SideBarLeft isOpen={isOpen} />
			</div>
			<div className={`${isOpen ? 'w-80' : 'w-100'} pa3`}>
				<ChatLayout />
			</div>
		</div >
	);
};