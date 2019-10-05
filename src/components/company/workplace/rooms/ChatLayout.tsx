import React from "react";
import { MessageItem } from "components/common/MessageItem";
import user from "../../../../resources/images/user.png";
import { Loading } from 'components/common/field/Loading';
import { isEqual } from 'lodash';
import { SendMessageForm } from './SendMessageForm';
const { withChatkit } = require("@pusher/chatkit-client-react");

interface ChatLayoutProps {
	messages: any;
	chatkit?: any;
}

export const ChatLayout = withChatkit((props: ChatLayoutProps) => {

	return (
		<div>
			<div className="relative">
				{/* Message-List */}
				<div
					className="overflow-y-auto"
					style={{ height: "calc(100vh - 176px)" }}
				>
					{!props.chatkit.isLoading && props.chatkit.currentUser.rooms.length > 0 ? props.messages.length ? props.messages.map((message: any, i: number, arr: any) => {
						return (
							<MessageItem
								key={message.id}
								img={user}
								text={message.text}
								createdAt={message.createdAt}
								sender={message.userStore.users[message.senderId]}
								lastChild={isEqual(message.id, arr[props.messages.length - 1].id)}
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