import React from "react";
import { ButtonGroup, Alignment, Button, Icon } from "@blueprintjs/core";
import { NavLink } from "react-router-dom";
import { User } from "stores/user/Reducer";
import { CompanyModel } from "stores/company/Reducer";
import { connect } from "react-redux";

const SidebarComponent = (props: {
	user: User;
	company: CompanyModel;
	type: string;
	companyName: string;
}) => {
	return (
		<div className="fixed bg-white w3 w6-m w11-l vh-100 br b--black-10">
			<ButtonGroup
				alignText={Alignment.LEFT}
				className="bp3-minimal bp3-vertical bp3-fill sidebar-margin"
			>
				{props.type === "default" ? (
					<NavLink
						exact
						className="mt6"
						style={{ color: "dimgray" }}
						activeStyle={{
							background: "#0fa3a3",
							color: "white"
						}}
						to={`/${props.user.name}`}
					>
						<Button
							className="outline-0 bp3-large"
							style={{ color: "inherit", padding: "0px" }}
						>
							<Icon
								icon="user"
								className="pr4-l pr3-m pl3-l"
								style={{ color: "inherit" }}
							/>
							Profile
						</Button>
					</NavLink>
				) : (
					<>
						<h1
							className="ml4 ml3-m f4 tigrow-lightBlue ttc"
							style={{ marginTop: "3rem" }}
						>
							{props.companyName}
						</h1>
						<NavLink
							exact
							className="mt5"
							style={{ color: "dimgray" }}
							activeStyle={{ background: "#0fa3a3", color: "white" }}
							to={`/company/${props.company.name}`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: "inherit", padding: "0px" }}
							>
								<Icon
									icon="user"
									className="pr4-l pr3-m pl3-l"
									style={{ color: "inherit" }}
								/>
								Profile
							</Button>
						</NavLink>
						{/* <NavLink
							exact
							className="mt5"
							style={{ color: 'dimgray' }}
							activeStyle={{ background: '#0fa3a3', color: 'white' }}
							to={`/company/${props.company.name}/feed`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: 'inherit', padding: '0px' }}
							>
								<Icon
									icon="page-layout"
									className="pr4-l pr3-m pl3-l"
									style={{ color: 'inherit' }}
								/>
								Feed
						</Button>
						</NavLink> */}
						<NavLink
							exact
							style={{ color: "dimgray" }}
							activeStyle={{ background: "#0fa3a3", color: "white" }}
							to={`/company/${props.company.name}/room`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: "inherit", padding: "0px" }}
							>
								<Icon
									icon="square"
									className="pr4-l pr3-m pl3-l"
									style={{ color: "inherit" }}
								/>
								Room
							</Button>
						</NavLink>
						<NavLink
							exact
							style={{ color: "dimgray" }}
							activeStyle={{ background: "#0fa3a3", color: "white" }}
							to={`/company/${props.company.name}/board`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: "inherit", padding: "0px" }}
							>
								<Icon
									icon="briefcase"
									className="pr4-l pr3-m pl3-l"
									style={{ color: "inherit" }}
								/>
								Board
							</Button>
						</NavLink>
						<NavLink
							exact
							style={{ color: "dimgray" }}
							activeStyle={{ background: "#0fa3a3", color: "white" }}
							to={`/company/${props.company.name}/team`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: "inherit", padding: "0px" }}
							>
								<Icon
									icon="people"
									className="pr4-l pr3-m pl3-l"
									style={{ color: "inherit" }}
								/>
								Team
							</Button>
						</NavLink>
						<NavLink
							exact
							style={{ color: "dimgray" }}
							activeStyle={{ background: "#0fa3a3", color: "white" }}
							to={`/company/${props.company.name}/settings`}
						>
							<Button
								className="outline-0 bp3-large"
								style={{ color: "inherit", padding: "0px" }}
							>
								<Icon
									icon="cog"
									className="pr4-l pr3-m pl3-l"
									style={{ color: "inherit" }}
								/>
								Settings
							</Button>
						</NavLink>
					</>
				)}
			</ButtonGroup>
		</div>
	);
};

const mapStateToProps = (state: any) => {
	return {
		companyName: state.companyReducer.currentCompany.name
	};
};

export const Sidebar = connect(mapStateToProps)(SidebarComponent);
