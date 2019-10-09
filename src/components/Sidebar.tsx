import React from "react";
import { ButtonGroup, Alignment, Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { User } from 'stores/user/Reducer';
import { CompanyModel } from 'stores/company/Reducer';

const SidebarComponent = (props: {
	user: User;
	company: CompanyModel;
	type: string;
}) => {

	return (
		<div className="fixed bg-white w3 w6-m w11-l pt6 vh-100 br b--tigrowLightGray-1">
			<ButtonGroup
				alignText={Alignment.LEFT}
				className="bp3-minimal bp3-vertical bp3-fill pl1"
			>
				{props.type === 'default' ?
					<Link to={`/${props.user.username}`}>
						<Button className="mv2" icon="user">
							Profile
								</Button>
					</Link>
					:
					<>
						<Link to={`/company/${props.company.name}/feed`}>
							<Button className="mv2" icon="control">
								Feed
						</Button>
						</Link>
						<Link to={`/company/${props.company.name}/room`} >
							<Button className="mv2" icon="layout-auto">
								Room
						</Button>
						</Link>
						<Link to={`/company/${props.company.name}/task`} >
							<Button className="mv2" icon="briefcase">
								Task
						</Button>
						</Link>
						<Link to={`/company/${props.company.name}/team`} >
							<Button className="mv2" icon="people">
								Team
						</Button>
						</Link>
						<Link to={`/company/${props.company.name}`} >
							<Button className="mv2" icon="layout-auto">
								Profile
						</Button>
						</Link>
					</>
				}
			</ButtonGroup>
		</div>
	);
};

export const Sidebar = SidebarComponent;