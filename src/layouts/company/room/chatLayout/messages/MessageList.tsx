import React, { useEffect, useRef, useState } from 'react';
import { MessageItem } from 'layouts/company/room/chatLayout/messages/MessageItem';
import { useSelector } from 'react-redux';

import { IRoomMessage } from 'stores/room/Reducer';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface MessageListProps {
	chatkit?: any;
}

export const MessageList = withChatkit((_props: MessageListProps) => {
	const [first, setFirst] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messages = useSelector((state: any) => state.roomReducer.messages);
	const roomId = useSelector((state: any) => state.roomReducer.roomId);

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

	const checkGroup = (cm: IRoomMessage, currIndex: number, arr: IRoomMessage[]) => {
		const obj = {
			message: false,
			showPicAndName: true
		};

		obj.message = currIndex !== arr.length - 1 && cm.account._id === arr[currIndex + 1].account._id;

		if (currIndex > 0 && cm.account._id === arr[currIndex - 1].account._id) {
			obj.showPicAndName = false;
			return obj;
		}

		return obj;

	};

	return (
		<div
			// className="overflow-y-auto ph1 pt2"
			className="flex flex-column flex-grow-1 overflow-y-auto ph1 pt2"
			ref={messagesEndRef}
		// style={{ height: "calc(100vh - 186px)" }}
		>
			{messages.length
				? messages.map((message: IRoomMessage, index: number, arr: IRoomMessage[]) => {
					return (
						<MessageItem
							key={index}
							message={message}
							group={checkGroup(message, index, arr)}
						/>
					);
				})
				: ''}
		</div>
	);
});
