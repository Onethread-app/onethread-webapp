import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { NavbarTop } from "components/Navbar";
import { WorkplaceSidebar } from "components/WorkplaceSidebar";
import { RoomList } from 'components/company/workplace/rooms/RoomList';

export const RoomPageComponent = (props: any) => {

	const [rooms] = useState([{
		id: "1", roomImg: "http://mrmrs.github.io/photos/p/2.jpg",
		roomTitle: "Backend",
	}, {
		id: "2", roomImg: "http://mrmrs.github.io/photos/p/3.jpg",
		roomTitle: "Frontend",
	},
	{
		id: "3", roomImg: "http://mrmrs.github.io/photos/p/4.jpg",
		roomTitle: "UX/UI",
	}, {
		id: "4",
		roomImg: "http://mrmrs.github.io/photos/p/5.jpg",
		roomTitle: "SQA",
	}]);

	useEffect(() => {

	}, []);

	// set chatkitUser
	// useEffect(() => {
	// 	props.storeChatkitUserAction(user)
	// }, [user]);

	return (
		<div className="bg-near-white">
			<NavbarTop />
			<div className="w-100 cf ">
				<div className="fl bg-white w-10 pv6 vh-100 fixed">
					<WorkplaceSidebar />
				</div>
				<div className="fl w-80 mt5" style={{ marginLeft: "10rem" }}>
					<div className="fl w-20 ba pa2">
						<RoomList
							rooms={rooms}
						/>
					</div>
					<div className="fl w-80 ba pa2">chat</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state: any) => {
	return {
		chatkit: state.chatkit,
	};
};

export const RoomPage = connect(mapStateToProps, null)(withRouter(RoomPageComponent));