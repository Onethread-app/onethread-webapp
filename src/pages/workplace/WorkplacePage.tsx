import React from "react";
import { NavbarTop } from "components/Navbar";
import { WorkplaceSidebar } from "components/WorkplaceSidebar";

export const WorkplacePage = () => {
	return (
		<div className="bg-near-white vh-100">
			<NavbarTop />
			<div className="w-100 cf ">
				<div className="fl bg-white w-25-ns w-15-l pv6 vh-100 fixed">
					<WorkplaceSidebar />
				</div>
				<div className="fl w-75-ns w-85-l ml7-l ml6-ns">
					<p>Workplace Page</p>
				</div>
			</div>
		</div>
	);
};
