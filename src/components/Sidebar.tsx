import React from "react";
import { ButtonGroup, Alignment, Button, Icon } from "@blueprintjs/core";
import { NavLink } from "react-router-dom";
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
				className="bp3-minimal bp3-vertical bp3-fill sidebar-margin"
			>
				{props.type === 'default' ?
					<NavLink exact activeStyle={{ background: "#0fa3a3" }} to={`/${props.user.name}`}>
						<Button name="userProfile" className=" outline-0 " style={{ color: 'white' }}>
							<Icon icon="user" style={{ color: 'white', marginRight: '25px' }} />
							Profile
						</Button>
					</NavLink>
					:
					<>
						<NavLink exact activeStyle={{ background: "#0fa3a3" }} to={`/company/${props.company.name}/feed`}>
							<Button className="mv2 outline-0" icon="control">
								Feed
						</Button>
						</NavLink>
						<NavLink exact activeStyle={{ background: "#0fa3a3" }} to={`/company/${props.company.name}/room`} >
							<Button className="mv2 outline-0" icon="layout-auto">
								Room
						</Button>
						</NavLink>
						<NavLink exact activeStyle={{ background: "#0fa3a3" }} to={`/company/${props.company.name}/task`} >
							<Button className="mv2 outline-0" icon="briefcase">
								Task
						</Button>
						</NavLink>
						<NavLink exact activeStyle={{ background: "#0fa3a3" }} to={`/company/${props.company.name}/team`} >
							<Button className="mv2 outline-0" icon="people">
								Team
						</Button>
						</NavLink>
						<NavLink exact activeStyle={{ background: "#0fa3a3" }} to={`/company/${props.company.name}`} >
							<Button className="mv2 outline-0" icon="layout-auto">
								Profile
						</Button>
						</NavLink>
						<NavLink exact activeStyle={{ background: "#0fa3a3" }} to={`/company/${props.company.name}/settings`} >
							<Button className="mv2 outline-0" icon="cog">
								Settings
						</Button>
						</NavLink>
					</>
				}
			</ButtonGroup>
		</div>
	);
};

export const Sidebar = SidebarComponent;