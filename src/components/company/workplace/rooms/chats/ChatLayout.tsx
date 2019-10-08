import React from "react";
import { MessageItem } from "components/common/MessageItem";
import user from "../../../../../resources/images/user.png";
import { Loading } from 'components/common/field/Loading';
import { SendMessageForm } from './SendMessageForm';
const { withChatkit } = require("@pusher/chatkit-client-react");

interface ChatLayoutProps {
	messages: any;
	chatkit?: any;
}

export const ChatLayout = withChatkit((props: ChatLayoutProps) => {

	return (
		<div>
			<div
				className="mh3-">
				{/* Message-List */}
				<div
					className="overflow-y-auto ph1 bg-tigrowLightestBlue"
					style={{ height: "calc(100vh - 202px)" }}
				>
					{!props.chatkit.isLoading && props.chatkit.currentUser.rooms.length > 0 ? props.messages.length ? props.messages.map((message: any, i: number, arr: any) => {
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