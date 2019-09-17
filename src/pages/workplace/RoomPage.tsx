import React from "react";
import { NavbarTop } from "components/Navbar";
import { WorkplaceSidebar } from "components/WorkplaceSidebar";

export const RoomPage = () => {
	return (
		<div className="bg-near-white vh-100">
			<NavbarTop />
			<div className="w-100 cf ">
				<div className="fl w-25-ns w-15-l pa2 bg-light-blue">
					<WorkplaceSidebar />
				</div>
				<div className="fl w-75-ns w-85-l  pa2 bg-light-yellow">
					<p>Room</p>
				</div>
			</div>
		</div>
	);
};
