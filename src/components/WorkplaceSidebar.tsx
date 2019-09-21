import React from "react";
import { Collapse, ButtonGroup, Alignment, Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";

export const WorkplaceSidebar = () => {
	return (
		<Collapse isOpen keepChildrenMounted>
			<div className=" bg-white">
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
			</div>
		</Collapse>
	);
};
