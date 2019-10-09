import React from "react";
import { MessageItem } from "components/common/MessageItem";
import user from "../../../../../resources/images/user.png";
import { Loading } from 'components/common/field/Loading';
import { SendMessageForm } from './SendMessageForm';
import { useSelector } from 'react-redux';
const { withChatkit } = require("@pusher/chatkit-client-react");

interface ChatLayoutProps {
	chatkit?: any;
}

export const ChatLayout = withChatkit((props: ChatLayoutProps) => {
	const messages = useSelector((state: any) => state.roomReducer.messages);

	return (
		<div>
			<div
				className="mh3-">
				{/* Message-List */}
				<div
					className="overflow-y-auto ph1 bg-tigrowLightestBlue pt2"
					style={{ height: "calc(100vh - 176px)" }}
				>
					{!props.chatkit.isLoading && props.chatkit.currentUser.rooms.length > 0 ? messages.length && messages[0].id !== null ? messages.map((message: any, i: number, arr: any) => {
						return (
							<MessageItem
								key={message.id}
								img={user}
								text={message.text}
								createdAt={message.createdAt}
								sender={message.userStore.users[message.senderId]}
							/>
						);
					}) : <Loading /> : <p className="bg-tigrow">Nothing to show!!</p>}
				</div>

				{/* SendMessage */}
				<SendMessageForm />
			</div>
		</div>
	)
})