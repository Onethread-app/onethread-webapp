import React, { useState, useEffect } from "react";
import { SendMessageForm } from './SendMessageForm';
import { MessageList } from './MessageList';
import { connect } from 'react-redux';
import { Button, Icon, Dialog } from '@blueprintjs/core';
import { AddMemberForm } from './AddMemberForm';
import { getRoomMembers } from 'stores/room/Actions';
import { isEmpty } from "lodash";

interface ChatLayoutComponentProps {
	getRoomMembers: (roomId: string) => void;
	roomName: string;
	roomId: string;
	roomMembers: string;
}

export const ChatLayoutComponent = (props: ChatLayoutComponentProps) => {
	const [showDialog, setShowDialog] = useState(false);

	useEffect(() => {
		if (!isEmpty(props.roomId)) {
			props.getRoomMembers(props.roomId);
		}
	}, [props.roomId])

	return (
		<div>
			{props.roomName &&
				<>
					<div className="flex justify-between items-center ph3 bb b--tigrowLightGray-1">
						<div>
							<p className="f4 fw7 mv1">{props.roomName}</p>
							<h5 className="ma0">Members: {props.roomMembers.length}</h5>
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
					<MessageList />
					<SendMessageForm />
				</>}
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
};

const mapStateToProps = (state: any) => {
	return {
		roomName: state.roomReducer.roomName,
		roomId: state.roomReducer.roomId,
		roomMembers: state.roomReducer.roomMembers,
	}
}
export const ChatLayout = connect(mapStateToProps, { getRoomMembers })(ChatLayoutComponent)