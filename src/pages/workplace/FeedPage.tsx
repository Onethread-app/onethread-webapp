import React from "react";
import { NavbarTop } from "components/Navbar";
import { WorkplaceSidebar } from "components/WorkplaceSidebar";

export const FeedPage = () => {
	return (
		<div className="bg-near-white">
			<NavbarTop />
			<div className="w-100 cf ">
				<div className="fl bg-white w-10 pv6 vh-100 fixed">
					<WorkplaceSidebar />
				</div>
				<div className="fl w-80 mt6 ml7">
					<p>Feed Page</p>
				</div>
			</div>
		</div>
	);
};
