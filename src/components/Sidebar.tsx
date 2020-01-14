import React from 'react';
import { ButtonGroup, Alignment, Button, Icon } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import { User } from 'stores/user/Reducer';
import { CompanyModel } from 'stores/company/Reducer';
import { connect } from 'react-redux';

import logo from '../resources/images/logo.png';

const SidebarComponent = (props: {
	user: User;
	company: CompanyModel;
	type: string;
	companyName: string;
	leftOpen: boolean;
}) => {
	return (
		<div className="vh-100 flex flex-column"
			style={{
				background: '#060517',
				display: props.leftOpen ? 'flex' : 'none'
			}}
		>
			<div className="bp3-navbar-group bp3-align-left ml3">
				<div
					style={{
						marginTop: '4rem',
						height: '5rem',
						width: '5rem'
					}}>
					<NavLink to={`/${props.user.name}`}
						className="mt6"
						style={{ color: 'dimgray' }}>
						<img src={logo} />
					</NavLink>
				</div>
			</div>
			<ButtonGroup
				alignText={Alignment.LEFT}
				className={`flex-grow-1 bp3-minimal bp3-vertical bp3-fill sidebar-margin   
				content`}
				style={{
					transition: 'transform 0.4s',
				}}
			>
				{props.type === 'default' ? (
					<NavLink
						exact
						className="mt6"
						style={{ color: 'dimgray' }}
						activeStyle={{
							background: '#3F61C5',
							color: 'white'
						}}
						to={`/${props.user.name}`}
					>
						<Button
							className="outline-0 bp3-large"
							style={{ color: 'inherit', padding: '0px' }}
						>
							<Icon
								icon="user"
								className="pr4-l pr3-m pl3-l"
								style={{ color: 'inherit' }}
							/>
							Profile
						</Button>
					</NavLink>
				) : (
						<>
							<NavLink
								exact
								className="ml4 ml3-m f4 tigrow-lightBlue ttc mr2 ws-break"
								style={{ marginTop: '3rem' }}
								to={`/company/${props.company.name}`}
							>
								{props.companyName}
							</NavLink>
							<NavLink
								exact
								className="mt5"
								style={{ color: 'dimgray' }}
								activeStyle={{ background: '#3F61C5', color: 'white' }}
								to={`/company/${props.company.name}`}
							>
								<Button
									className="outline-0 bp3-large"
									style={{ color: 'inherit', padding: '0px' }}
								>
									<Icon
										icon="user"
										className="pr4-l pr3-m pl3-l"
										style={{ color: 'inherit' }}
									/>
									Profile
							</Button>
							</NavLink>
							<NavLink
								exact
								style={{ color: 'dimgray' }}
								activeStyle={{ background: '#3F61C5', color: 'white' }}
								to={`/company/${props.company.name}/room`}
							>
								<Button
									className="outline-0 bp3-large"
									style={{ color: 'inherit', padding: '0px' }}
								>
									<Icon
										icon="square"
										className="pr4-l pr3-m pl3-l"
										style={{ color: 'inherit' }}
									/>
									Room
							</Button>
							</NavLink>
							<NavLink
								exact
								style={{ color: 'dimgray' }}
								activeStyle={{ background: '#3F61C5', color: 'white' }}
								to={`/company/${props.company.name}/board`}
							>
								<Button
									className="outline-0 bp3-large"
									style={{ color: 'inherit', padding: '0px' }}
								>
									<Icon
										icon="briefcase"
										className="pr4-l pr3-m pl3-l"
										style={{ color: 'inherit' }}
									/>
									Board
							</Button>
							</NavLink>
							<NavLink
								exact
								style={{ color: 'dimgray' }}
								activeStyle={{ background: '#3F61C5', color: 'white' }}
								to={`/company/${props.company.name}/team`}
							>
								<Button
									className="outline-0 bp3-large"
									style={{ color: 'inherit', padding: '0px' }}
								>
									<Icon
										icon="people"
										className="pr4-l pr3-m pl3-l"
										style={{ color: 'inherit' }}
									/>
									Team
							</Button>
							</NavLink>
							<NavLink
								exact
								style={{ color: 'dimgray' }}
								activeStyle={{ background: '#3F61C5', color: 'white' }}
								to={`/company/${props.company.name}/settings`}
							>
								<Button
									className="outline-0 bp3-large"
									style={{ color: 'inherit', padding: '0px' }}
								>
									<Icon
										icon="cog"
										className="pr4-l pr3-m pl3-l"
										style={{ color: 'inherit' }}
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
