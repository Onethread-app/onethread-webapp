import React from "react";
import { Collapse, ButtonGroup, Alignment, Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";

export const Sidebar = () => {
	// const [showCollapse, setShowCollapse] = useState(false);
	return (
		// {showCollapse &&
		<Collapse isOpen keepChildrenMounted>
			<div className=" bg-white">
				<ButtonGroup
					alignText={Alignment.LEFT}
					className="bp3-minimal bp3-vertical bp3-fill pl3"
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
			</div>
		</Collapse>
		// }
	);
};
