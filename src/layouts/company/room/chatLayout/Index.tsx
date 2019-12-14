import React, { useState, useEffect } from "react";
import { SendMessageForm } from './messages/SendMessageForm';
import { MessageList } from './messages/MessageList';
import { connect } from 'react-redux';
import { Button, Icon, Dialog } from '@blueprintjs/core';
import { AddMemberForm } from './members/AddMemberForm';
import { getRoomMembers } from 'stores/room/Actions';
import { isEmpty } from "lodash";
import { showAddMember } from 'stores/UtilsActions';
import { MembersList } from './members/MembersList';

interface ChatLayoutComponentProps {
	getRoomMembers: (roomId: string) => void;
	activeRoom: any;
	companyRole: string;
	users: [];
}

export const ChatLayoutComponent = (props: ChatLayoutComponentProps) => {
	const [showMemberFormDialog, setShowMemberFormDialog] = useState(false);
	const [showMemberListDialog, setShowMemberListDialog] = useState(false);

	useEffect(() => {
		if (!isEmpty(props.activeRoom)) {
			props.getRoomMembers(props.activeRoom.id);
		}
	}, [props.activeRoom]);

	return (
		<>
			{isEmpty(props.activeRoom) === false ?
				<div>
					{/* chat heading starts */}
					<div className="flex justify-between items-center ph4 pv2 bb b--tigrowLightGray-1">
						<div>
							<p className="f4 fw7 mv2">{props.activeRoom.name}</p>
							<h5
								onClick={() => setShowMemberListDialog(!showMemberListDialog)}
								className="ma0 pointer dim">Members: {props.activeRoom.users.length}</h5>
						</div>
						{showAddMember(props.activeRoom.name, props.companyRole) ?
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
							: null}
					</div>
					{/* chat heading ends */}
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
					isOpen={showMemberFormDialog}
					style={{ background: '#fff' }}
				>
					<AddMemberForm
						showDialog={showMemberFormDialog}
						setShowDialog={() => setShowMemberFormDialog(!showMemberFormDialog)}
					/>
				</Dialog>
			)}
			{showMemberListDialog && (
				<Dialog
					onClose={() => setShowMemberListDialog(!showMemberListDialog)}
					isOpen={showMemberListDialog}
					style={{ background: '#fff' }}
				>
					<MembersList
						users={props.users} />
				</Dialog>
			)}
		</>
	)
};

const mapStateToProps = (state: any) => {
	return {
		activeRoom: state.roomReducer.activeRoom,
		users: state.roomReducer.users,
		companyRole: state.companyReducer.currentCompany.role,
	}
}
export const ChatLayout = connect(mapStateToProps, { getRoomMembers })(ChatLayoutComponent)