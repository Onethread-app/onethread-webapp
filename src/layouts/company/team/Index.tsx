import React, { useState, useEffect } from 'react';
import {
	Button,
	HTMLTable,
	Dialog,
	Popover,
	Position,
	Icon,
	ButtonGroup,
	Alignment
} from '@blueprintjs/core';
import { AddMemberForm } from 'layouts/company/team/AddMemberForm';
import { connect } from 'react-redux';
import {
	getCompanyMembers,
	getAllDepartments,
	addDesignation,
	editDesignation,
	changeMemberRole,
	getCompanyPendingMembers
} from 'stores/company/Actions';
import { CompanyModel, ICompanyMembers, ICompanyPendingMembers } from 'stores/company/Reducer';
import { Loading } from 'components/Loading';
import { permit } from 'stores/UtilsActions';
import { AddDesignationForm } from 'layouts/company/team/AddDesignationForm';
import { EditDesignationForm } from 'layouts/company/team/EditDesignationForm';
import { isEqual, upperFirst, chunk } from 'lodash';
import { User } from 'stores/user/Reducer';

interface TeamMember {
	company: CompanyModel;
	user: User;
	getCompanyMembers: () => void;
	getCompanyPendingMembers: (limit?: number, skip?: number) => void;
	getAllDepartments: () => void;
	addDesignation: (values: any, memberId: string) => void;
	editDesignation: (values: any, memberId: string) => void;
	changeMemberRole: (values: { role: string }, memberId: string) => void;
	companyLoading: boolean;
}

// tslint:disable-next-line: no-shadowed-variable
const load = async (getCompanyMembers: () => void,
	// tslint:disable-next-line: no-shadowed-variable
	getCompanyPendingMembers: (limit?: number, skip?: number) => void) => {
	await getCompanyMembers();
	await getCompanyPendingMembers();
};

const TeamMembersPageComponent = (props: TeamMember) => {
	const [showDialog, setShowDialog] = useState(false);
	const [showDialogAdd, setShowDialogAdd] = useState(false);
	const [showDialogEdit, setShowDialogEdit] = useState(false);
	const [editMember, setEditMember] = useState<ICompanyMembers | undefined>(undefined);
	const [membersList, setMembersList] = useState<ICompanyMembers[]>([]);
	const [adminsList, setAdminsList] = useState<ICompanyMembers[]>([]);
	const [pendingList, setPendingList] = useState<ICompanyPendingMembers[][]>([]);

	const divisions = [
		{ _id: 'director', name: 'Director' },
		{ _id: 'cxo', name: 'CXO' },
		{ _id: 'seniorManager', name: 'Senior Manager' },
		{ _id: 'middleManager', name: 'Middle Manager' },
		{ _id: 'operationalEmployee', name: 'Operational Employee' }
	];

	const getDivisionName = {
		director: 'Director',
		cxo: 'CXO',
		seniorManager: 'Senior Manager',
		middleManager: 'Middle Manager',
		operationalEmployee: 'Operational Employee'
	};

	// tslint:disable-next-line:no-shadowed-variable
	const showDepartment = (member: ICompanyMembers) => {
		if (
			member.designations.length &&
			['director', 'cxo'].includes(member.designations[0].division) === false
		) {
			// show department
			if (
				member.designations[0].department &&
				member.designations[0].department.name
			) {
				return member.designations[0].department.name;
			} else {
				return null;
			}
		} else {
			return null;
		}
	};

	useEffect(() => {
		load(props.getCompanyMembers, props.getCompanyPendingMembers);
	}, []);

	useEffect(() => {
		if (props.company &&
			props.company.members &&
			props.company.members.length) {
			const a: ICompanyMembers[] = [];
			const b: ICompanyMembers[] = [];
			props.company.members.forEach(m => {
				if (permit(m.role)) {
					a.push(m);
				} else {
					b.push(m);
				}
			});
			setAdminsList(a);
			setMembersList(b);
		}
	}, [props.company.members]);

	useEffect(() => {
		if (props.company &&
			props.company.pendingMembers &&
			props.company.pendingMembers.length) {
			setPendingList(chunk(props.company.pendingMembers, 4));
		}
	}, [props.company.pendingMembers]);

	return (
		<>
			<div className="ph5">
				<div className="flex justify-between items-center">
					<h1 className="tigrow-lightGray-1">Colleagues</h1>
					{permit(props.company.role) ? (
						<Button
							className="grow fr h2 pointer white bp3-minimal "
							style={{
								background: '#0fa3a3',
								outline: 'none',
								color: 'white'
							}}
							onClick={() => setShowDialog(!showDialog)}
						>
							Add Colleagues
							</Button>
					) : (
							undefined
						)}
				</div>
				{/* Admins list starts */}
				<h1 className="f4 mb0 tigrow-lightGray-1">Admins</h1>
				<HTMLTable className="w-100 mv3" striped={true}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Division</th>
							<th>Department</th>
							<th>Position</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{props.companyLoading ? (
							<Loading />
						) :
							adminsList.length ? (
								// tslint:disable-next-line: no-shadowed-variable
								adminsList.map(member => (
									<tr className="hide-child" key={member._id}>
										<td>
											<span className="mr2">{upperFirst(member.account.firstName)} {upperFirst(member.account.lastName)}</span>
											{permit(member.role) ? (
												member.role === 'superAdmin' ? (
													<Icon
														icon="star"
														style={{ color: 'rgb(228, 162, 0)' }}
													/>
												) : (
														<Icon icon="star" />
													)
											) : null}
										</td>
										<td>
											{member.designations.length
												? getDivisionName[member.designations[0].division]
												: null}
										</td>
										<td>
											<small className="f6">
												{showDepartment(member)}
											</small>
										</td>
										<td>
											{member.designations.length ?
												<small className="f6">
													{member.designations[0].position}
												</small>
												: null}
										</td>
										{/* Popover starts */}
										<td>
											{permit(props.company.role) ||
												isEqual(member.account._id, props.user._id) ? (
													<Popover
														className="fr"
														position={Position.BOTTOM}
														popoverClassName="bp3-popover-content-sizing bg-white"
														content={
															<ButtonGroup
																alignText={Alignment.LEFT}
																className="bp3-minimal bp3-vertical bp3-fill"
															>
																{permit(props.company.role) &&
																	isEqual(member.role, 'superAdmin') === false ? (
																		isEqual(member.role, 'admin') === true ? (
																			<Button
																				className="outline-0 bp3-large bp3-popover-dismiss"
																				onClick={async () => {
																					await props.changeMemberRole(
																						{ role: 'employee' },
																						member._id
																					);
																				}}
																			>
																				<Icon
																					icon="build"
																					className="pr4-l pr3-m pl2"
																					style={{ color: 'inherit' }}
																				/>
																				Make Employee
																	</Button>
																		) : (
																				<Button
																					className="outline-0 bp3-large bp3-popover-dismiss"
																					onClick={async () => {
																						await props.changeMemberRole(
																							{ role: 'admin' },
																							member._id
																						);
																					}}
																				>
																					<Icon
																						icon="star"
																						className="pr4-l pr3-m pl2"
																						style={{ color: 'inherit' }}
																					/>
																					Make Admin
																	</Button>
																			)
																	) : null}

																{member.designations &&
																	member.designations.length ? (
																		<>
																			<Button
																				className="outline-0 bp3-large bp3-popover-dismiss"
																				onClick={async () => {
																					setEditMember(member);
																					await props.getAllDepartments();
																					setShowDialogEdit(!showDialogEdit);
																				}}
																			>
																				<Icon
																					icon="edit"
																					className="pr4-l pr3-m pl2"
																					style={{ color: 'inherit' }}
																				/>
																				Edit Designation
																	</Button>
																		</>
																	) : (
																		<>
																			<Button
																				className="outline-0 bp3-large bp3-popover-dismiss"
																				onClick={async () => {
																					setEditMember(member);
																					await props.getAllDepartments();
																					setShowDialogAdd(!showDialogAdd);
																				}}
																			>
																				<Icon
																					icon="add"
																					className="pr4-l pr3-m pl2"
																					style={{ color: 'inherit' }}
																				/>
																				Add Designation
																	</Button>
																		</>
																	)}
															</ButtonGroup>
														}
														target={
															<Icon
																className=" pointer"
																icon="drag-handle-vertical"
															/>
														}
													/>
												) : (
													undefined
												)}
											{/* Popover ends */}
										</td>
									</tr>
								))
							) : (
									<tr>
										<td colSpan={3}>No admins</td>
									</tr>
								)}
					</tbody>
				</HTMLTable>
				{/* Admins list ends */}
				{/* members list starts */}
				<h1 className="f4 mb0 tigrow-lightGray-1">Members</h1>
				<HTMLTable className="w-100 mv3" striped={true}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Division</th>
							<th>Department</th>
							<th>Position</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{props.companyLoading ? (
							<Loading />
						) :
							membersList.length ? (
								// tslint:disable-next-line: no-shadowed-variable
								membersList.map(member => (
									<tr className="hide-child" key={member._id}>
										<td>
											<span className="mr2">{upperFirst(member.account.firstName)} {upperFirst(member.account.lastName)}</span>
											{permit(member.role) ? (
												member.role === 'superAdmin' ? (
													<Icon
														icon="star"
														style={{ color: 'rgb(228, 162, 0)' }}
													/>
												) : (
														<Icon icon="star" />
													)
											) : null}
										</td>
										<td>
											{member.designations.length
												? getDivisionName[member.designations[0].division]
												: null}
										</td>
										<td>
											<small className="f6">
												{showDepartment(member)}
											</small>
										</td>
										<td>
											{member.designations.length ?
												<small className="f6">
													{member.designations[0].position}
												</small>
												: null}
										</td>
										{/* Popover starts */}
										<td>
											{permit(props.company.role) ||
												isEqual(member.account._id, props.user._id) ? (
													<Popover
														className="fr"
														position={Position.BOTTOM}
														popoverClassName="bp3-popover-content-sizing bg-white"
														content={
															<ButtonGroup
																alignText={Alignment.LEFT}
																className="bp3-minimal bp3-vertical bp3-fill"
															>
																{permit(props.company.role) &&
																	isEqual(member.role, 'superAdmin') === false ? (
																		isEqual(member.role, 'admin') === true ? (
																			<Button
																				className="outline-0 bp3-large bp3-popover-dismiss"
																				onClick={async () => {
																					await props.changeMemberRole(
																						{ role: 'employee' },
																						member._id
																					);
																				}}
																			>
																				<Icon
																					icon="build"
																					className="pr4-l pr3-m pl2"
																					style={{ color: 'inherit' }}
																				/>
																				Make Employee
																	</Button>
																		) : (
																				<Button
																					className="outline-0 bp3-large bp3-popover-dismiss"
																					onClick={async () => {
																						await props.changeMemberRole(
																							{ role: 'admin' },
																							member._id
																						);
																					}}
																				>
																					<Icon
																						icon="star"
																						className="pr4-l pr3-m pl2"
																						style={{ color: 'inherit' }}
																					/>
																					Make Admin
																	</Button>
																			)
																	) : null}

																{member.designations &&
																	member.designations.length ? (
																		<>
																			<Button
																				className="outline-0 bp3-large bp3-popover-dismiss"
																				onClick={async () => {
																					setEditMember(member);
																					await props.getAllDepartments();
																					setShowDialogEdit(!showDialogEdit);
																				}}
																			>
																				<Icon
																					icon="edit"
																					className="pr4-l pr3-m pl2"
																					style={{ color: 'inherit' }}
																				/>
																				Edit Designation
																	</Button>
																		</>
																	) : (
																		<>
																			<Button
																				className="outline-0 bp3-large bp3-popover-dismiss"
																				onClick={async () => {
																					setEditMember(member);
																					await props.getAllDepartments();
																					setShowDialogAdd(!showDialogAdd);
																				}}
																			>
																				<Icon
																					icon="add"
																					className="pr4-l pr3-m pl2"
																					style={{ color: 'inherit' }}
																				/>
																				Add Designation
																	</Button>
																		</>
																	)}
															</ButtonGroup>
														}
														target={
															<Icon
																className=" pointer"
																icon="drag-handle-vertical"
															/>
														}
													/>
												) : (
													undefined
												)}
											{/* Popover ends */}
										</td>
									</tr>
								))
							) : (
									<tr>
										<td colSpan={3}>No members</td>
									</tr>
								)}
					</tbody>
				</HTMLTable>
				{/* members list ends */}
				{/* pending list starts */}
				{permit(props.company.role) ? (
					<>
						<h1 className="f4 tigrow-lightGray-1">Pending request</h1>
						<HTMLTable className="w-100 mv3" striped={true}>
							<tbody>
								{props.companyLoading ? (
									<Loading />
								) :
									pendingList.length ? (
										// tslint:disable-next-line: no-shadowed-variable
										pendingList.map((chunkMembers, i1) => (
											<tr className="hide-child" key={i1}>
												{chunkMembers.map(member =>
													(<td>
														<span className="mr2">{member.email}</span>
													</td>)
												)}
											</tr>
										))
									) : (
											<tr>
												<td colSpan={3}>No pending request</td>
											</tr>
										)}
							</tbody>
						</HTMLTable>
					</>
				) : (
						undefined
					)}
				{/* pending list ends */}
			</div>

			{showDialog && (
				<Dialog
					onClose={() => setShowDialog(!showDialog)}
					isOpen={showDialog}
					style={{ background: '#fff' }}
					canOutsideClickClose={false}
				>
					<AddMemberForm
						showDialog={showDialog}
						setShowDialog={e => setShowDialog(!showDialog)}
					/>
				</Dialog>
			)}
			{showDialogAdd && (
				<Dialog
					onClose={() => setShowDialogAdd(!showDialogAdd)}
					isOpen={showDialogAdd}
					style={{ background: '#fff' }}
				>
					<AddDesignationForm
						addDesignation={props.addDesignation}
						getCompanyMembers={props.getCompanyMembers}
						member={editMember}
						divisions={divisions}
						departments={props.company.departments}
						setShowDialogAdd={e => setShowDialogAdd(!showDialogAdd)}
					/>
				</Dialog>
			)}
			{showDialogEdit && (
				<Dialog
					onClose={() => setShowDialogEdit(!showDialogEdit)}
					isOpen={showDialogEdit}
					style={{ background: '#fff' }}
				>
					<EditDesignationForm
						editDesignation={props.editDesignation}
						getCompanyMembers={props.getCompanyMembers}
						member={editMember}
						divisions={divisions}
						departments={props.company.departments}
						setShowDialogEdit={e => setShowDialogEdit(!showDialogEdit)}
					/>
				</Dialog>
			)}
		</>
	);
};

const mapStateToProps = (state: any) => {
	return {
		company: state.companyReducer.currentCompany,
		companyLoading: state.companyReducer.loading,
		user: state.userReducer.user
	};
};

export const TeamMembersPage = connect(mapStateToProps, {
	getCompanyMembers,
	getAllDepartments,
	addDesignation,
	editDesignation,
	changeMemberRole,
	getCompanyPendingMembers
})(TeamMembersPageComponent);
