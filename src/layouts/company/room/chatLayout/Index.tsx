import React, { useState } from 'react';
import { SendMessageForm } from './messages/SendMessageForm';
import { MessageList } from './messages/MessageList';
import { connect } from 'react-redux';
import { Button, Icon, Dialog, Position, Popover } from '@blueprintjs/core';
import { AddMemberForm } from './members/AddMemberForm';
import { getRoomMembers } from 'stores/room/Actions';
import { isEmpty } from 'lodash';
import { permit } from 'stores/UtilsActions';
import { MembersList } from './members/MembersList';
import { RightSidebar } from 'components/RightSidebar';
import { IRoomReducer } from 'stores/room/Reducer';

import memberListIcon from './../../../../resources/images/member-list.svg';
import addMemberIcon from './../../../../resources/images/addMemberIcon.png';
import settingsIcon from './../../../../resources/images/settings.svg';

interface ChatLayoutComponentProps {
	getRoomMembers: (roomId: string) => void;
	roomId: IRoomReducer['roomId'];
	roomName: IRoomReducer['roomName'];
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
			{isEmpty(props.roomName) === false && isEmpty(props.roomId) === false ?
				<div
					className="flex flex-column h-100"
				// style={{ height: "calc(100vh - 50px)" }}
				>
					{/* chat heading starts */}
					<div className="flex justify-between items-center ph4 pv2 bb b--tigrowLightGray-1">
						<div>
							<p className="f4 fw7 mv2">{props.roomName}</p>
							<div
								onClick={() => setShowMemberListDialog(!showMemberListDialog)}
								className="ma0 pointer dim flex items-center">
								<img
									className=""
									src={memberListIcon}
									width="20px"
									height="20px"
									style={{
									}}
									color="#0FA3A3"
								/>
								<span className="f5 ml2 fw7">{props.users.length}</span>
							</div>
						</div>
						<div>
							<Popover
								className="mr2"
								minimal={true}
								position={Position.BOTTOM}
								popoverClassName="bg-white pa3"
								content={
									<div>
										<h5 className="gray ma0 mb2 pointer"
											onClick={() => { console.log('mute'); }}
										>Mute Conversation</h5>
										<h5 className="red ma0 pointer"
											onClick={() => { console.log('Archive'); }}
										>Archive Room</h5>
									</div>
								}
								target={
									<div>
										<img
											className="grow"
											src={settingsIcon}
											width="30px"
											height="30px"
										/>
									</div>
								}
							/>
							{permit(props.companyRole) ?
								<Popover
									className=""
									minimal={true}
									position={Position.BOTTOM}
									popoverClassName="bp3-popover-content-sizing bg-white"
									content={
										<AddMemberForm
											showDialog={showMemberFormDialog}
											setShowDialog={() => setShowMemberFormDialog(!showMemberFormDialog)}
										/>
									}
									target={
										<div>
											<img
												className="grow"
												src={addMemberIcon}
												width="30px"
												height="30px"
											/>
										</div>
									}
								/>
								: null}
						</div>
					</div>
					{/* chat heading ends */}
					<MessageList />
					<SendMessageForm />
				</div>
				: <div className="absolute--center tc">
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

			{/* {showMemberFormDialog &&
				<RightSidebar
					onClose={() => setShowMemberFormDialog(!showMemberFormDialog)}
				>
					<AddMemberForm
						showDialog={showMemberFormDialog}
						setShowDialog={() => setShowMemberFormDialog(!showMemberFormDialog)}
					/>
				</RightSidebar>
			} */}

		</>
	);
};

const mapStateToProps = (state: any) => {
	return {
		roomId: state.roomReducer.roomId,
		roomName: state.roomReducer.roomName,
		activeRoom: state.roomReducer.activeRoom,
		users: state.roomReducer.users,
		userStatus: state.roomReducer.userStatus,
		companyRole: state.companyReducer.currentCompany.role,
	};
};

export const ChatLayout = connect(mapStateToProps, { getRoomMembers })(ChatLayoutComponent);