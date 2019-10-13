import React from "react";
import { SendMessageForm } from './SendMessageForm';
import { MessageList } from './MessageList';
import { useSelector } from 'react-redux';
import { Button, Icon } from '@blueprintjs/core';

interface ChatLayoutProps {
}

export const ChatLayout = (props: ChatLayoutProps) => {
	const roomName = useSelector((state: any) => state.roomReducer.roomName);
	return (
		<div>
			<div className="flex justify-between ph3 bb b--tigrowLightGray-1">
				<p className="f4 fw7 mv1">{roomName}</p>
				<Button
					className="bp3-minimal ma1 outline-0 grow"
					style={{ background: "#F55B7F" }}
				>
					<Icon
						icon="new-person"
						style={{ background: "#F55B7F", color: "white" }}
					/>
				</Button>
			</div>
			<div>
				<MessageList />
				<SendMessageForm />
			</div>
		</div>
	)
}