import React, { useState, useEffect } from "react";
import { SendMessageForm } from './SendMessageForm';
import { MessageList } from './MessageList';
import { connect } from 'react-redux';
import { Button, Icon, Dialog } from '@blueprintjs/core';
import { AddMemberForm } from './AddMemberForm';
import { getRoomMembers } from 'stores/room/Actions';
import { isEmpty } from "lodash";
import MembersList from './members/MembersList';

interface ChatLayoutComponentProps {
	getRoomMembers: (roomId: string) => void;
	activeRoom: any;
	users: [];
}

export const ChatLayoutComponent = (props: ChatLayoutComponentProps) => {
	const [showMemberFormDialog, setShowMemberFormDialog] = useState(false);
	const [showMemberListDialog, setShowMemberListDialog] = useState(false);

	useEffect(() => {
		if (!isEmpty(props.activeRoom)) {
			props.getRoomMembers(props.activeRoom.id);
		}
	}, [props.activeRoom])

	return (
		<>
			{!isEmpty(props.activeRoom) ?
				<div>
					<div className="flex justify-between items-center ph3 bb b--tigrowLightGray-1">
						<div>
							<p className="f4 fw7 mv1">{props.activeRoom.name}</p>
							<h5
								onClick={() => setShowMemberListDialog(!showMemberListDialog)}
								className="ma0 pointer">Members: {props.activeRoom.users.length}</h5>
						</div>
						<Button
							onClick={() => setShowMemberFormDialog(!showMemberFormDialog)}
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
				</div> :
				<div className="absolute--center tc">
					<h2>Please, select a room!!</h2>
					<p>General is a default room.</p>
				</div>
			}
			{showMemberFormDialog && (
				<Dialog
					onClose={() => setShowMemberFormDialog(!showMemberFormDialog)}
					title="Add Members"
					isOpen={showMemberFormDialog}
					style={{ background: '#fff' }}
				>
					<AddMemberForm
						showDialog={showMemberFormDialog}
						setShowDialog={e => setShowMemberFormDialog(!showMemberFormDialog)}
					/>
				</Dialog>
			)}
			{showMemberListDialog && (
				<Dialog
					onClose={() => setShowMemberListDialog(!showMemberListDialog)}
					title="Room Members"
					isOpen={showMemberListDialog}
					style={{ background: '#fff' }}
				>
					<MembersList users={props.users} />
				</Dialog>
			)}
		</>
	)
};

const mapStateToProps = (state: any) => {
	return {
		activeRoom: state.roomReducer.activeRoom,
		users: state.roomReducer.users
	}
}
export const ChatLayout = connect(mapStateToProps, { getRoomMembers })(ChatLayoutComponent)