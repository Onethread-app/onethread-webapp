import React, { useEffect, useRef, useState } from 'react';
import { MessageItem } from 'layouts/company/room/chatLayout/messages/MessageItem';
import { useSelector } from 'react-redux';

import UserIcon from './../../../../../resources/images/user.png';
import { IRoomMessage } from 'stores/room/Reducer';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface MessageListProps {
	chatkit?: any;
}

export const MessageList = withChatkit((props: MessageListProps) => {
	const [first, setFirst] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messages = useSelector((state: any) => state.roomReducer.messages);
	const roomId = useSelector((state: any) => state.roomReducer.roomId);
	const rooms = useSelector((state: any) => state.roomReducer.rooms);
	// const typingUsers = useSelector(
	// 	(state: any) => state.roomReducer.typing.users
	// );

	const scrollToBottom = () => {
		// On new message, scroll to bottom
		if (
			messagesEndRef &&
			messagesEndRef.current &&
			messagesEndRef.current.scrollTop +
			messagesEndRef.current.clientHeight +
			66 * 4 >=
			messagesEndRef.current.scrollHeight
		) {
			messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
		} else if (messagesEndRef && messagesEndRef.current && !first) {
			messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
			setFirst(true);
		}
	};
	useEffect(() => {
		setFirst(false);
	}, [roomId]);

	useEffect(scrollToBottom, [messages]);

	return (
		<div
			// className="overflow-y-auto ph1 pt2"
			className="flex flex-column flex-grow-1 overflow-y-auto ph1 pt2"
			ref={messagesEndRef}
		// style={{ height: "calc(100vh - 186px)" }}
		>
			{!props.chatkit.isLoading && rooms.length
				? messages.length
					? messages.map((message: IRoomMessage) => {
						return (
							<MessageItem
								key={message._id}
								img={UserIcon}
								text={message.text}
								createdAt={message.createdAt}
								sender={message.account}
							/>
						);
					})
					: ''
				: ''}
		</div>
	);
});
