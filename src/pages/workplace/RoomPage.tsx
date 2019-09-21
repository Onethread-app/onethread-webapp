import React from "react";
import { NavbarTop } from "components/Navbar";
import { WorkplaceSidebar } from "components/WorkplaceSidebar";
import { RoomList } from 'components/company/workplace/rooms/RoomList';

export const RoomPage = () => {
	return (
		<div className="bg-near-white">
			<NavbarTop />
			<div className="w-100 cf ">
				<div className="fl bg-white w-10 pv6 vh-100 fixed">
					<WorkplaceSidebar />
				</div>
				<div className="fl w-80 mt5" style={{ marginLeft: "10rem" }}>
					<div className="fl w-30 ba pa2"><RoomList /></div>
					<div className="fl w-70 ba pa2">chat</div>
				</div>
			</div>
		</div>
	);
};
