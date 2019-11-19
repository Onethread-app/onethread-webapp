import * as React from "react";
import { useSelector } from "react-redux";
import { isEmpty, isEqual } from "lodash";
const { withChatkit } = require("@pusher/chatkit-client-react");

interface RoomListItemProps {
	roomId: string;
	name: string;
	img: string;
	lastChild: boolean;
	active: string;
	unreadCount: number;
	subscribeToRoom: (roomId: string, name: string) => void;
	chatkit?: any;
}

export const RoomListItem = withChatkit((props: RoomListItemProps) => {
	const activeRoom = useSelector((state: any) => state.roomReducer.activeRoom);
	return (
		<article
			onClick={() => {
				if (!props.chatkit.isLoading && !isEqual(props.roomId, activeRoom.id)) {
					if (!isEmpty(activeRoom)) {
						props.chatkit.currentUser.roomSubscriptions[activeRoom.id].cancel();
					}
					props.subscribeToRoom(props.roomId, props.name);
				}
			}}
			id="roomListItem"
			className={`flex items-center mh2 ph1 pv2 bb b--black-10 pointer ${
				props.active
			} ${props.lastChild ? "bn" : ""}`}
		>
			<div className="dn db-ns pr3">
				<span className="ttc ba b--black-10 db w1 w2-ns h1 h2-ns br3 tc lh-2 bg-light-gray">
					{props.img}
				</span>
			</div>
			<div className="flex justify-around items-center">
				<h1 className="ttc f7 f6-ns fw4 mv0">{props.name}</h1>
				{props.unreadCount > 0 ? (
					<h6
						className="bg-tigrowLightBlue white fw8 ma0 ml1"
						style={{
							padding: "4px 8px",
							borderRadius: "50%"
						}}
					>
						{props.unreadCount}
					</h6>
				) : null}
			</div>
		</article>
	);
});
