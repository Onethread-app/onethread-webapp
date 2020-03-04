import React from 'react';
import { NavLink } from 'react-router-dom';
import { User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';

import logo from '../resources/images/logo.png';
import tigrowLogo from '../resources/images/tigrowLogo.png';
import individualProfile from '../resources/images/sidebarIndividualProfile.svg';
import companyProfile from '../resources/images/sidebarCompanyProfile.svg';
import room from '../resources/images/sidebarRoom.svg';
import board from '../resources/images/sideBarBoard.svg';
import team from '../resources/images/sidebarTeam.svg';
import settings from '../resources/images/sidebarSettings.svg';
import associates from '../resources/images/sideBarAssociates.svg';

import { Tooltip } from '@blueprintjs/core';

export const Sidebar = (props: {
	user: User;
	company: ICompany;
	type: string;
	leftOpen: boolean;
}) => {
	return (
		<div
			style={{
				background: '#060517'
			}}
		>
			<div
				className={`${props.leftOpen ? 'db ml4 mv3' : 'dn'} `}
				style={{ width: '6rem' }}
			>
				<NavLink to={`/${props.user.name}`}>
					{props.leftOpen ?
						<img src={logo} />
						:
						<img src={tigrowLogo} />
					}
				</NavLink>
			</div>
			<div className={`${props.leftOpen ? 'pt4' : 'pt5'}`}>
				{props.type === 'default' ? (
					<NavLink
						exact
						className="ma1 hover-bg-white-20 flex items-center nowrap"
						style={{ color: 'white' }}
						activeStyle={{ background: '#3F61C5' }}
						to={`/${props.user.name}`}
					>
						{props.leftOpen ?
							<span className="pl4">
								<img
									src={individualProfile}
									className="w2 pt1"
								/>
							</span> :
							<Tooltip
								content={<p className="mb0">Individual Profile</p>}
								position="right"
							>
								<span className="pl3">
									<img
										src={individualProfile}
										className="w2 pt1"
									/>
								</span>
							</Tooltip>
						}
						{props.leftOpen &&
							<span
								className="outline-0 bp3-large pl4"
								style={{
									color: 'inherit'
								}}
							>
								Profile
							</span>
						}

					</NavLink>
				) : (
						<>
							<NavLink
								exact
								className="flex items-center nowrap ma1 hover-bg-white-20"
								style={{ color: 'white' }}
								activeStyle={{ background: '#3F61C5' }}
								to={`/company/${props.company.name}`}
							>
								{props.leftOpen ?
									<span className="pl4">
										<img
											src={companyProfile}
											className="w2 pt1"
										/>
									</span> :
									<Tooltip
										content={<p className="mb0">Company Profile</p>}
										position="right"
									>
										<span className="pl3">
											<img
												src={companyProfile}
												className="w2 pt1"
											/>
										</span>
									</Tooltip>
								}
								{props.leftOpen &&
									<span
										className="outline-0 bp3-large pl4"
										style={{ color: 'inherit' }}
									>
										Profile
								</span>
								}
							</NavLink>
							<NavLink
								exact
								className="flex items-center nowrap ma1 hover-bg-white-20"
								style={{ color: 'white' }}
								activeStyle={{ background: '#3F61C5' }}
								to={`/company/${props.company.name}/room`}
							>
								{props.leftOpen ?
									<span className="pl4">
										<img
											src={room}
											className="w2 pt1"
										/>
									</span> :
									<Tooltip
										content={<p className="mb0">Room</p>}
										position="right"
									>
										<span className="pl3">
											<img
												src={room}
												className="w2 pt1"
											/>
										</span>
									</Tooltip>
								}
								{props.leftOpen &&
									<span
										className="outline-0 bp3-large pl4"
										style={{ color: 'inherit' }}
									>
										Room
								</span>
								}
							</NavLink>
							<NavLink
								exact
								className="flex items-center nowrap ma1 hover-bg-white-20"
								style={{ color: 'white' }}
								activeStyle={{ background: '#3F61C5' }}
								to={`/company/${props.company.name}/board`}
							>
								{props.leftOpen ?
									<span className="pl4">
										<img
											src={board}
											className="w2 pt1"
										/>
									</span> :
									<Tooltip
										content={<p className="mb0">Board</p>}
										position="right"
									>
										<span className="pl3">
											<img
												src={board}
												className="w2 pt1"
											/>
										</span>
									</Tooltip>
								}
								{props.leftOpen &&
									<span
										className="outline-0 bp3-large pl4"
										style={{ color: 'inherit' }}
									>
										Board
								</span>
								}
							</NavLink>
							<NavLink
								exact
								className="flex items-center nowrap ma1 hover-bg-white-20"
								style={{ color: 'white' }}
								activeStyle={{ background: '#3F61C5' }}
								to={`/company/${props.company.name}/team`}
							>
								{props.leftOpen ?
									<span className="pl4">
										<img
											src={team}
											className="w2 pt1"
										/>
									</span> :
									<Tooltip
										content={<p className="mb0">Team</p>}
										position="right"
									>
										<span className="pl3">
											<img
												src={team}
												className="w2 pt1"
											/>
										</span>
									</Tooltip>
								}
								{props.leftOpen &&
									<span
										className="outline-0 bp3-large pl4"
										style={{ color: 'inherit' }}
									>
										Team
								</span>
								}
							</NavLink>
							<NavLink
								exact
								className="w-100 flex items-center nowrap ma1 hover-bg-white-20"
								style={{ color: 'white' }}
								activeStyle={{ background: '#3F61C5' }}
								to={`/company/${props.company.name}/settings`}
							>
								{props.leftOpen ?
									<span className="pl4">
										<img
											src={settings}
											className="w2 pt1"
										/>
									</span> :
									<Tooltip
										content={<p className="mb0">Settings</p>}
										position="right"
									>
										<span className="pl3">
											<img
												src={settings}
												className="w2 pt1"
											/>
										</span>
									</Tooltip>
								}
								{props.leftOpen &&
									<span
										className="outline-0 bp3-large pl4"
										style={{ color: 'inherit' }}
									>
										Settings
								</span>
								}
							</NavLink>
							<NavLink
								exact
								className="w-100 flex items-center nowrap ma1 hover-bg-white-20"
								style={{ color: 'white' }}
								activeStyle={{ background: '#3F61C5' }}
								to={`/company/${props.company.name}/associates`}
							>
								{props.leftOpen ?
									<span className="pl4">
										<img
											src={associates}
											className="w2 pt1"
										/>
									</span> :
									<Tooltip
										content={<p className="mb0">Associates</p>}
										position="right"
									>
										<span className="pl3">
											<img
												src={settings}
												className="w2 pt1"
											/>
										</span>
									</Tooltip>
								}
								{props.leftOpen &&
									<span
										className="outline-0 bp3-large pl4"
										style={{ color: 'inherit' }}
									>
										Associates
								</span>
								}
							</NavLink>
						</>
					)}
			</div>
		</div>
	);
};
