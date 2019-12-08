import React, { useState } from "react";
import { RoomList } from "./RoomList";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Dialog, Icon } from "@blueprintjs/core";
import { CreateForm } from "./Form";
import { permit } from "stores/UtilsActions";
import { clearRoomError } from "stores/room/Actions";
import { IconNames } from "@blueprintjs/icons";

interface RoomSideBarComponentProps {
	companyRole?: string;
	isOpen: boolean;
	chatkit?: any;
}
interface RoomSideBarInternalProps
	extends RoomSideBarComponentProps,
	RouteComponentProps {
	clearRoomError: () => void;
}
const RoomSideBarComponent = (props: RoomSideBarInternalProps) => {
	const [showDialog, setShowDialog] = useState(false);

	return (
		<>
			<div className={`t-25-a ${props.isOpen ? "db" : "dn"}`}>
				<div className="flex justify-between items-center ph3">
					<h3 className="tigrow-darkGray">Rooms</h3>
					{props.companyRole && permit(props.companyRole) ? (
						<Icon
							icon={IconNames.ADD}
							iconSize={20}
							className="grow pointer tigrow-lightBlue pr2"
							onClick={() => setShowDialog(!showDialog)}
						/>
					) : (
							undefined
						)}
				</div>
				<RoomList />
			</div>
			{showDialog && (
				<Dialog
					onClose={() => {
						props.clearRoomError();
						setShowDialog(!showDialog);
					}}
					isOpen
					style={{ background: "#fff" }}
				>
					<CreateForm
						setShowDialog={setShowDialog}
					/>
				</Dialog>
			)}
		</>
	);
};

const mapStateToProps = (state: any) => {
	return {
		companyRole: state.companyReducer.currentCompany.role
	};
};

export const RoomSideBar = connect(mapStateToProps, { clearRoomError })(
	withRouter(RoomSideBarComponent)
);
