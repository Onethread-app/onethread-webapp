import React, { useState, useEffect, Fragment } from "react";
import { SendMessageForm } from './SendMessageForm';
import { MessageList } from './MessageList';
import { useSelector, connect } from 'react-redux';
import { Button, Icon, Dialog } from '@blueprintjs/core';
import { AddMemberForm } from './AddMemberForm';
import { getRoomMembers } from 'stores/room/Actions';
import { isEmpty } from "lodash";

interface ChatLayoutComponentProps {
	getRoomMembers: (roomId: string) => void;
}

export const ChatLayoutComponent = (props: ChatLayoutComponentProps) => {
	const [showDialog, setShowDialog] = useState(false);
	const { roomName, roomId, roomMembers } = useSelector((state: any) => state.roomReducer);

	useEffect(() => {
		if (!isEmpty(roomId)) {
			props.getRoomMembers(roomId);
		}
	}, [roomId])

	return (
		<div>
			{roomName &&
				<Fragment>
					<div className="flex justify-between items-center ph3 bb b--tigrowLightGray-1">
						<div>
							<p className="f4 fw7 mv1">{roomName}</p>
							<h5 className="ma0">Members: {roomMembers.length}</h5>
						</div>
						<Button
							onClick={() => setShowDialog(!showDialog)}
							className="bp3-minimal outline-0 grow"
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
				</Fragment>}
			{showDialog && (
				<Dialog
					onClose={() => setShowDialog(!showDialog)}
					title="Add Members"
					isOpen={showDialog}
					style={{ background: '#fff' }}
				>
					<AddMemberForm
						showDialog={showDialog}
						setShowDialog={e => setShowDialog(!showDialog)}
					/>
				</Dialog>
			)}
		</div>
	)
}

export const ChatLayout = connect(null, { getRoomMembers })(ChatLayoutComponent)