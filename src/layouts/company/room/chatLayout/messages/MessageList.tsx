import React, { useEffect, useRef, useState } from 'react';
import { MessageItem } from 'layouts/company/room/chatLayout/messages/MessageItem';
import { connect, useDispatch } from 'react-redux';
import { getRoomMessages } from '../../../../../stores/room/Actions';
import { IRoomMessage, IRoomReducer } from 'stores/room/Reducer';
import { ALL_MESSAGE_RECEIVED } from 'stores/room/Types';
import { Icon } from '@blueprintjs/core';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface MessageListProps {
	chatkit?: any;
	getRoomMessages: (roomId: string, limit?: number, skip?: number) => void;
	messages: IRoomReducer['messages'];
	roomId: IRoomReducer['roomId'];
	allMessages: boolean;
}

export const MessageListComponent = withChatkit((props: MessageListProps) => {
	const [first, setFirst] = useState(false);
	const [limit, setLimit] = useState(15);
	const [skip, setSkip] = useState(0);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();

	const scrollToBottom = () => {
		if (props.messages.length) {
			props.chatkit.currentUser.setReadCursor({
				roomId: props.roomId,
				position: props.messages[props.messages.length - 1].chatkitId
			})
				.then()
				.catch((err: any) => {
					console.log(`Error setting cursor: ${err}`);
				});
		}

		// On new message, scroll to bottom
		if (
			messagesEndRef &&
			messagesEndRef.current &&
			messagesEndRef.current.scrollTop +
			messagesEndRef.current.clientHeight +
			60 >=
			messagesEndRef.current.scrollHeight
		) {
			// On new message, scroll to bottom
			messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
		} else if (messagesEndRef && messagesEndRef.current && !first) {
			// On enter the room, scroll to bottom
			messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
			setFirst(true);
		}
	};

	const loadMoreMessages = async () => {
		if (props.allMessages === false) {
			const n = skip + limit;
			setSkip(n);
			await props.getRoomMessages(props.roomId, limit, n);
		}
	};

	useEffect(() => {
		setFirst(false);
		setLimit(15);
		setSkip(0);
		dispatch({ type: ALL_MESSAGE_RECEIVED, payload: false });
	}, [props.roomId]);

	useEffect(scrollToBottom, [props.messages]);

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
			id="message-container"
			className="flex flex-column flex-grow-1 overflow-y-auto ph1 pt2"
			ref={messagesEndRef}
		// style={{ height: "calc(100vh - 186px)" }}
		>
			{props.allMessages === false && props.messages.length > 0 ?
				<div
					className="flex justify-center items-center"
					onClick={loadMoreMessages}
				>
					<h6
						className="pv1 ph2 mv0 white br2 pointer flex justify-center items-center"
						style={{
							backgroundColor: 'rgb(92, 108, 142)'
						}}
					>
						<Icon icon="upload" iconSize={18} />
						<span style={{
							fontSize: '11px',
							marginLeft: '6px'
						}}>load more</span>
					</h6>
				</div>
				: undefined
			}
			{props.messages.length
				? props.messages.map((message: IRoomMessage, index: number, arr: IRoomMessage[]) => {
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

const mapStateToProps = (state: any) => {
	return {
		roomId: state.roomReducer.roomId,
		messages: state.roomReducer.messages,
		allMessages: state.roomReducer.allMessages,
	};
};

export const MessageList = connect(mapStateToProps, { getRoomMessages })(
	MessageListComponent
);
