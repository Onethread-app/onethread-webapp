import React, { useState, useEffect } from "react";
import {
	Button,
	HTMLTable,
	Dialog,
	Popover,
	Position,
	Icon,
	ButtonGroup,
	Alignment
} from "@blueprintjs/core";
import { AddMemberForm } from "layouts/company/team/AddMemberForm";
import { connect } from "react-redux";
import {
	getCompanyMembers,
	getAllDepartments,
	addDesignation,
	editDesignation,
	changeMemberRole
} from "stores/company/Actions";
import { CompanyModel, ICompanyMembers } from "stores/company/Reducer";
import { Loading } from "components/Loading";
import { permit } from "stores/UtilsActions";
import { AddDesignationForm } from "layouts/company/team/AddDesignationForm";
import { EditDesignationForm } from "layouts/company/team/EditDesignationForm";
import { isEqual } from 'lodash';
import { User } from 'stores/user/Reducer';

const divisions = [
	{ _id: "director", name: "Director" },
	{ _id: "cxo", name: "CXO" },
	{ _id: "seniorManager", name: "Senior Manager" },
	{ _id: "middleManager", name: "Middle Manager" },
	{ _id: "operationalEmployee", name: "Operational Employee" }
];

interface TeamMember {
	company: CompanyModel;
	user: User;
	getCompanyMembers: () => void;
	getAllDepartments: () => void;
	addDesignation: (values: any, memberId: string) => void;
	editDesignation: (values: any, memberId: string) => void;
	changeMemberRole: (values: { role: string }, memberId: string) => void;
	companyLoading: boolean;
}

const loadCompanyMember = async (getCompanyMembers: () => void) => {
	await getCompanyMembers();
};

const TeamMembersPageComponent = (props: TeamMember) => {
	const [showDialog, setShowDialog] = useState(false);
	const [showDialogAdd, setShowDialogAdd] = useState(false);
	const [showDialogEdit, setShowDialogEdit] = useState(false);
	const [member, setMember] = useState<ICompanyMembers | undefined>(undefined);

	useEffect(() => {
		loadCompanyMember(props.getCompanyMembers);
	}, []);

	const showDepartment = (member: ICompanyMembers) => {
		if (
			member.designations.length &&
			["director", "cxo"].includes(member.designations[0].division) === false
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

	return (
		<>
			<div>
				<h1 className="f4 tigrow-lightGray-1 ml4 mb0 mt5">Team</h1>
				<div className="cf bg-white mh4 mv3 br3 pa4 shadow-4 w-90">
					<div>
						<h1 className="f5 lh-title tigrow-lightGray-1 dib">Team Members</h1>
						{permit(props.company.role) ? (
							<Button
								className="grow fr h2 pointer white bp3-minimal "
								style={{
									background: "#0fa3a3",
									outline: "none",
									color: "white"
								}}
								onClick={() => setShowDialog(!showDialog)}
							>
								Add Team Members
							</Button>
						) : (
								undefined
							)}
					</div>
					<HTMLTable className="w-100 mt4" striped={true}>
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
							) : props.company &&
								props.company.members &&
								props.company.members.length > 0 ? (
										props.company.members.map(member => (
											<tr className="hide-child">
												<td><small className="mr2">{member.account.name}</small>
													{
														permit(member.role) ? member.role === "superAdmin" ? <Icon icon="star" style={{ "color": "rgb(228, 162, 0)" }} /> : <Icon icon="star" /> : null
													}
												</td>
												<td>
													{member.designations.length
														? member.designations[0].division
														: null}
												</td>
												<td>{showDepartment(member)}</td>
												<td>
													{member.designations.length
														? member.designations[0].position
														: null}
												</td>
												<td className="flex justify-between">
													{/* Popover starts */}
													{permit(props.company.role) || isEqual(member.account._id, props.user._id) ? (
														<Popover
															className="fr"
															position={Position.BOTTOM}
															popoverClassName="bp3-popover-content-sizing bg-white"
															content={
																<ButtonGroup
																	alignText={Alignment.LEFT}
																	className="bp3-minimal bp3-vertical bp3-fill"
																>
																	{
																		permit(props.company.role) &&
																			isEqual(member.role, "superAdmin") === false ?
																			isEqual(member.role, "admin") === true ?
																				<Button
																					className="outline-0 bp3-large bp3-popover-dismiss"
																					onClick={async () => {
																						await props.changeMemberRole({ role: "employee" }, member._id)
																					}}
																				>
																					<Icon
																						icon="star"
																						className="pr4-l pr3-m pl2"
																						style={{ color: "inherit" }}
																					/>
																					Make Employee
																				</Button>
																				:
																				<Button
																					className="outline-0 bp3-large bp3-popover-dismiss"
																					onClick={async () => {
																						await props.changeMemberRole({ role: "admin" }, member._id)
																					}}
																				>
																					<Icon
																						icon="star"
																						className="pr4-l pr3-m pl2"
																						style={{ color: "inherit" }}
																					/>
																					Make Admin
																			</Button> : null
																	}

																	{member.designations &&
																		member.designations.length ? (
																			<>
																				<Button
																					className="outline-0 bp3-large bp3-popover-dismiss"
																					onClick={async () => {
																						setMember(member);
																						await props.getAllDepartments();
																						setShowDialogEdit(!showDialogEdit);
																					}}
																				>
																					<Icon
																						icon="edit"
																						className="pr4-l pr3-m pl2"
																						style={{ color: "inherit" }}
																					/>
																					Edit Designation
																				</Button>
																			</>
																		) : (
																			<>
																				<Button
																					className="outline-0 bp3-large bp3-popover-dismiss"
																					onClick={async () => {
																						setMember(member);
																						await props.getAllDepartments();
																						setShowDialogAdd(!showDialogAdd);
																					}}
																				>
																					<Icon
																						icon="add"
																						className="pr4-l pr3-m pl2"
																						style={{ color: "inherit" }}
																					/>Add Designation
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
				</div>
			</div>
			{showDialog && (
				<Dialog
					onClose={() => setShowDialog(!showDialog)}
					isOpen={showDialog}
					style={{ background: "#fff" }}
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
					style={{ background: "#fff" }}
				>
					<AddDesignationForm
						addDesignation={props.addDesignation}
						getCompanyMembers={props.getCompanyMembers}
						member={member}
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
					style={{ background: "#fff" }}
				>
					<EditDesignationForm
						editDesignation={props.editDesignation}
						getCompanyMembers={props.getCompanyMembers}
						member={member}
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
		user: state.userReducer.user,
	};
};

export const TeamMembersPage = connect(mapStateToProps, {
	getCompanyMembers,
	getAllDepartments,
	addDesignation,
	editDesignation,
	changeMemberRole
})(TeamMembersPageComponent);
