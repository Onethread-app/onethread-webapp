import React, { useState } from 'react';
import { SendMessageForm } from './messages/SendMessageForm';
import { MessageList } from './messages/MessageList';
import { connect } from 'react-redux';
import { Button, Icon, Dialog } from '@blueprintjs/core';
import { AddMemberForm } from './members/AddMemberForm';
import { getRoomMembers } from 'stores/room/Actions';
import { isEmpty } from 'lodash';
import { permit } from 'stores/UtilsActions';
import { MembersList } from './members/MembersList';
import { RightSidebar } from 'components/RightSidebar';
import { IRoomReducer } from 'stores/room/Reducer';

import memberListIcon from './../../../../resources/images/member-list.svg';

interface ChatLayoutComponentProps {
	getRoomMembers: (roomId: string) => void;
	activeRoom: any;
	companyRole: string;
	users: IRoomReducer['users'];
	userStatus: IRoomReducer['userStatus'];
}

export const ChatLayoutComponent = (props: ChatLayoutComponentProps) => {
	const [showMemberFormDialog, setShowMemberFormDialog] = useState(false);
	const [showMemberListDialog, setShowMemberListDialog] = useState(false);
	// TODO: future works
	// useEffect(() => {
	// 	if (!isEmpty(props.activeRoom)) {
	// 		props.getRoomMembers(props.activeRoom.id);
	// 	}
	// }, [props.activeRoom]);

	return (
		<>
			{isEmpty(props.activeRoom) === false ?
				<div
					className="flex flex-column h-100"
				// style={{ height: "calc(100vh - 50px)" }}
				>
					{/* chat heading starts */}
					<div className="flex justify-between items-center ph4 pv2 bb b--tigrowLightGray-1">
						<div>
							<p className="f4 fw7 mv2">{props.activeRoom.name}</p>
							<div
								onClick={() => setShowMemberListDialog(!showMemberListDialog)}
								className="ma0 pointer dim flex justify-between">
								<img
									className=""
									src={memberListIcon}
									width="20px"
									height="20px"
									style={{
									}}
									color="#0FA3A3"
								/>
								<span className="f5">{props.users.length}</span>
							</div>
						</div>
						{permit(props.companyRole) ?
							<Button
								onClick={() => setShowMemberFormDialog(!showMemberFormDialog)}
								className="bp3-minimal outline-0 grow"
								style={{ background: '#F55B7F' }}
							>
								<Icon
									icon="new-person"
									style={{ background: '#F55B7F', color: 'white' }}
								/>
							</Button>
							: null}
					</div>
					{/* chat heading ends */}
					<MessageList />
					<SendMessageForm />
				</div> :
				<div className="absolute--center tc">
					<h2>Please, select a room !!</h2>
				</div>
			}
			{showMemberListDialog && (
				<Dialog
					onClose={() => setShowMemberListDialog(!showMemberListDialog)}
					isOpen={showMemberListDialog}
					style={{ background: '#fff' }}
				>
					<MembersList
						users={props.users}
						userStatus={props.userStatus} />
				</Dialog>
			)}

			{showMemberFormDialog &&
				<RightSidebar
					onClose={() => setShowMemberFormDialog(!showMemberFormDialog)}
				>
					<AddMemberForm
						showDialog={showMemberFormDialog}
						setShowDialog={() => setShowMemberFormDialog(!showMemberFormDialog)}
					/>
				</RightSidebar>
			}

		</>
	);
};

const mapStateToProps = (state: any) => {
	return {
		activeRoom: state.roomReducer.activeRoom,
		users: state.roomReducer.users,
		userStatus: state.roomReducer.userStatus,
		companyRole: state.companyReducer.currentCompany.role,
	};
};

export const ChatLayout = connect(mapStateToProps, { getRoomMembers })(ChatLayoutComponent);