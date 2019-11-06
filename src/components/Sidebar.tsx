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
						<NavLink
							exact
							style={{ color: 'dimgray' }}
							activeStyle={{
								background: '#0fa3a3',
								color: 'white'
							}}
							to={`/${props.user.name}`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: 'inherit' }}
							>
								<Icon
									icon="user"
									style={{ marginRight: '20px', marginLeft: '5px', color: 'inherit' }} />
								Profile
						</Button>
						</NavLink>
					:
					<>
						<NavLink
							exact
							style={{ color: 'dimgray' }}
							activeStyle={{ background: '#0fa3a3', color: 'white' }}
							to={`/company/${props.company.name}/feed`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: 'inherit' }}
							>
								<Icon
									icon="page-layout"
									style={{ marginRight: '20px', marginLeft: '5px', color: 'inherit' }}
								/>
								Feed
						</Button>
						</NavLink>
						<NavLink
							exact
							style={{ color: 'dimgray' }}
							activeStyle={{ background: '#0fa3a3', color: 'white' }}
							to={`/company/${props.company.name}/room`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: 'inherit' }}
							>
								<Icon
									icon="square"
									style={{ marginRight: '20px', marginLeft: '5px', color: 'inherit' }}
								/>
								Room
						</Button>
						</NavLink>
						<NavLink
							exact
							style={{ color: 'dimgray' }}
							activeStyle={{ background: '#0fa3a3', color: 'white' }}
							to={`/company/${props.company.name}/task`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: 'inherit' }}
							>
								<Icon
									icon="briefcase"
									style={{ marginRight: '20px', marginLeft: '5px', color: 'inherit' }}
								/>
								Task
						</Button>
						</NavLink>
						<NavLink
							exact
							style={{ color: 'dimgray' }}
							activeStyle={{ background: '#0fa3a3', color: 'white' }}
							to={`/company/${props.company.name}/team`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: 'inherit' }}
							>
								<Icon
									icon="people"
									style={{ marginRight: '20px', marginLeft: '5px', color: 'inherit' }}
								/>
								Team
						</Button>
						</NavLink>
						<NavLink
							exact
							style={{ color: 'dimgray' }}
							activeStyle={{ background: '#0fa3a3', color: 'white' }}
							to={`/company/${props.company.name}`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: 'inherit' }}
							>
								<Icon
									icon="user"
									style={{ marginRight: '20px', marginLeft: '5px', color: 'inherit' }}
								/>
								Profile
						</Button>
						</NavLink>
						<NavLink
							exact
							style={{ color: 'dimgray' }}
							activeStyle={{ background: '#0fa3a3', color: 'white' }}
							to={`/company/${props.company.name}/settings`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: 'inherit' }}
							>
								<Icon
									icon="cog"
									style={{ marginRight: '20px', marginLeft: '5px', color: 'inherit' }}
								/>
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