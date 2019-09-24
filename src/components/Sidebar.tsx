import React from "react";
import { ButtonGroup, Alignment, Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";

const DefaultSidebar = () => (
	<ButtonGroup
		alignText={Alignment.LEFT}
		className="bp3-minimal bp3-vertical bp3-fill pl1"
	>
		<Link to="/workplace">
			<Button className="mv2" icon="control">
				Workplace
						</Button>
		</Link>
		<Link to="/workplace">
			<Button className="mv2" icon="user">
				Profile
						</Button>
		</Link>
		<Link to="/workplace">
			<Button className="mv2" icon="briefcase">
				Product
						</Button>
		</Link>
		<Link to="/workplace">
			<Button className="mv2" icon="properties">
				About
						</Button>
		</Link>
		<Link to="/workplace">
			<Button className="mv2" icon="function">
				Expo
						</Button>
		</Link>
		<Link to="/workplace">
			<Button className="mv2" icon="people">
				Admin panel
						</Button>
		</Link>
	</ButtonGroup>
)

const WorkPlaceSidebar = () => (
	<ButtonGroup
		alignText={Alignment.LEFT}
		className="bp3-minimal bp3-vertical bp3-fill pl3"
	>
		<Link to="/feed">
			<Button className="mv2" icon="control">
				Feed
						</Button>
		</Link>
		<Link to="/room">
			<Button className="mv2" icon="layout-auto">
				Room
						</Button>
		</Link>
		<Link to="/task">
			<Button className="mv2" icon="briefcase">
				Task
						</Button>
		</Link>
		<Link to="/team">
			<Button className="mv2" icon="people">
				Team
						</Button>
		</Link>
		<Link to="/create">
			<Button className="mv2" icon="add">
				Create
						</Button>
		</Link>
	</ButtonGroup>
)

const SidebarComponent = () => {
	return (
		<div className="fixed bg-white w5 pv6 vh-100">
			{true ?
				<DefaultSidebar />
				: <WorkPlaceSidebar />
			}
		</div>
	);
};

export const Sidebar = SidebarComponent
