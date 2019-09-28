import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { RoomList } from "components/company/workplace/rooms/RoomList";
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ChatLayout } from 'components/company/workplace/rooms/ChatLayout';

export const RoomPageComponent = (props: any) => {
	const [rooms] = useState([{
		id: "1",
		roomImg: "https://robohash.org/" + 1,
		roomTitle: "Back-End"
	}, {
		id: "2",
		roomImg: "https://robohash.org/" + 2,
		roomTitle: "Front-End"
	}, {
		id: "3",
		roomImg: "https://robohash.org/" + 3,
		roomTitle: "UX/UI"
	}, {
		id: "4",
		roomImg: "https://robohash.org/" + 4,
		roomTitle: "SQA"
	}]);
	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => {
		// TODO: actual room will be fetch later
		// if (!isEmpty(props.chatkit.user)) {
		// 	let r = props.chatkit.user.rooms.map((r: any) => {
		// 		return {
		// 			id: r.id,
		// 			roomImg: "https://robohash.org/" + r.id,
		// 			roomTitle: r.name
		// 		}
		// 	})

		// 	setRooms(r);
		// }
	}, [props.chatkit.user]);
	const o = isOpen ? "w-20" : "dn";
	return (
		<div className="flex relative" style={{ height: 'calc(100vh - 50px)' }}>
			<Button
				onClick={() => setIsOpen(!isOpen)}
				className="absolute top-0 left--1 mv2"
				icon={isOpen ? 'right-join' : 'left-join'}>
			</Button>
			<div className={"bg-white br b--tigrowLightGray-1 " + o}>
				<div className="ph3 mt5">
					<div className="flex">
						<div className="w-50 tl"><h3 className="tigrow-lightGray-1">Rooms</h3></div>
						<div className="w-50 tr">
							<Button
								className="mv2 bp3-button bp3-button bp3-intent-primary" icon={IconNames.ADD}>
							</Button>
						</div>
					</div>
					<RoomList rooms={rooms} />
				</div>
			</div>
			<div className="w-80 pa2">
				<ChatLayout />
			</div>
		</div >
	);
};

const mapStateToProps = (state: any) => {
	return {
		chatkit: state.chatkitReducer
	};
};

export const RoomPage = connect(
	mapStateToProps,
	null
)(withRouter(RoomPageComponent));
