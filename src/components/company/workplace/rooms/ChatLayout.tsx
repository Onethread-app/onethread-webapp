import React from "react";
import {
	Button,
	Icon
} from "@blueprintjs/core";
import { MessageItem } from "components/common/MessageItem";
import user from "../../../../resources/images/user.png";
import { Loading } from 'components/common/field/Loading';
import { isEqual } from 'lodash';

interface ChatLayoutProps {
	messages?: any
}

export const ChatLayout = (props: ChatLayoutProps) => {

	return (
		<div>
			<div className="relative">
				<div
					className="overflow-y-auto"
					style={{ height: "calc(100vh - 70px)" }}
				>
					{props.messages.length ? props.messages.map((message: any, i: number, arr: any) => {
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
					}) : <Loading />}
				</div>
				<div className="absolute bottom-0 br3 shadow-3 flex pa1 w-100 bg-tigrow">
					<div className="flex items-center mh1">
						<img src={user} className="dib" alt="user" />
					</div>
					<textarea
						className="bp3-input ma1 w-100 outline-0 shadow-0"
						style={{ resize: "none" }}
						placeholder="Write your message"
					></textarea>
					<div className="flex">
						<Button className="bp3-button bp3-minimal bp3-large">
							<Icon icon="media" style={{ color: "#0fa3a3" }} />
						</Button>
						<Button className="bp3-button bp3-minimal bp3-large">
							<Icon icon="link" style={{ color: "#0fa3a3" }} />
						</Button>
						<Button className="bp3-button bp3-minimal bp3-large">
							<Icon icon="insert" style={{ color: "#0fa3a3" }} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
};