import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { TaskBoard } from 'stores/board/Reducer';
import { CompanyModel } from 'stores/company/Reducer';
import { permit, boardColor } from 'stores/UtilsActions';
import { Button, Card, Elevation, Menu, MenuItem, Popover, HTMLSelect } from '@blueprintjs/core';
import { Loading } from 'components/Loading';
import { connect } from 'react-redux';
import { getAllBoards, getSelectedBoard } from 'stores/board/Actions';
import { getAllDepartments } from 'stores/company/Actions';
import { FormBoard } from './Form';
import { RightSidebar } from 'components/RightSidebar';
import { find } from 'lodash';

import addIcon from '../../../resources/images/addIcon.png';

interface IBoardCardComponent {
	boardList: TaskBoard[];
	company: CompanyModel;
	getSelectedBoard: (boardId: string | undefined) => Promise<number>;
}

const BoardCard = withRouter((props: IBoardCardComponent & RouteComponentProps) => (
	<>
		{props.boardList.map((board) => (
			<div className="pa2">
				<Card
					className="h-100"
					interactive={true}
					elevation={Elevation.TWO}
					onClick={async (e) => {
						e.preventDefault();
						const currentBoard: any = await props.getSelectedBoard(board._id);
						if (currentBoard._id) {
							props.history.push(`/company/${props.company.name}/board/${currentBoard._id}`);
						}
					}}
					style={{ paddingLeft: '0px', paddingBottom: '0px' }}
				>
					<div
						className="flex"
						style={{
							borderLeft: `5px solid 
							${find(boardColor, ['code', board.color]) ?
									find(boardColor, ['code', board.color])!.value : 'white'
								}`, // TODO use dictionary
							paddingLeft: '20px',
							marginLeft: '-2px',
							borderRadius: '3px'
						}}
					>
						<h3 className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f5"
							style={{
								height: '2.5rem',
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
							}}>
							{board.name}
						</h3>
						<Popover
							content={
								<Menu>
									<MenuItem
										text="Edit"
									// onClick={(e: any) => setShowColumnFormDialog(true)}
									/>
								</Menu>
							}
							target={
								<Button
									style={{
										transform: 'rotate(90deg)',
										OTransform: 'rotate(90deg)',
										msTransform: 'rotate(90deg)',
										WebkitTransform: 'rotate(90deg)'
									}}
									icon="more"
									minimal={true}
									small={true}
								/>
							}
						/>
					</div>
					<div className="flex pt3 pr3" style={{ justifyContent: 'space-between', paddingLeft: '20px' }}>
						<div>
							<p className="mb0 ws-break" style={{ fontSize: '0.7rem' }}>
								Total task
							</p>
							<p className="fw8">
								0
							</p>
						</div>
						<div>
							<p className="mb0 ws-break" style={{ fontSize: '0.7rem' }}>
								Total Members
							</p>
							<p className="fw8">
								{board.members ? board.members.length : 0}
							</p>
						</div>
					</div>

				</Card>
			</div>
		))}
	</>
));

interface IBoardListViewInternalProps {
	boardList: TaskBoard[];
	company: CompanyModel;
	getAllBoards: () => void;
	getAllDepartments: () => void;
	getSelectedBoard: (boardId: string | undefined) => Promise<number>;
}

const TaskPageComponent = (props: IBoardListViewInternalProps & RouteComponentProps) => {
	const [showTaskBoardDialog, setShowTaskBoardDialog] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			props.getAllBoards(),
			props.getAllDepartments()
		]).then(() => setLoading(false));
	}, []);

	const [department, setDepartment] = useState('');
	const boards = props.boardList.filter((board) => board.department === department);

	return (
		<div className="h-100">
			<div className="br3 bg-white h-100 pa4 cf flex flex-column">
				<div className="pl2 flex" style={{ justifyContent: 'space-between' }}>
					<h3 className="f3 mt2 lh-title tigrow-lightGray-1 dib">Board</h3>
					<div className="flex">
						<p className="pr3 fw7" style={{ marginTop: '.8rem' }}>Filter By</p>
						<div className="mt2" style={{ width: '200px' }}>
							<HTMLSelect
								fill={true}
								minimal={true}
								onChange={(event: any) => {
									setDepartment(event.currentTarget.value);
								}}
								style={{
									outline: 'none',
									border: '1px solid #E1E1E1',
									fontWeight: 600,
									textAlignLast: 'center'
								}}
							>
								<option selected value="">
									All
								</option>
								{props.company.departments ?
									props.company.departments.map((d) => (
										<option value={d._id}>{d.name}</option>
									))
									: undefined
								}
							</HTMLSelect>
						</div>
					</div>
				</div>
				<p className="pl2 mt3" style={{ color: '#6B6B6B' }}>My Boards</p>
				<div className="overflow-auto">
					{loading === false ? props.boardList.length > 0 ?
						<div
							style={{
								display: 'grid',
								gridGap: '5px',
								gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 270px))',
								gridTemplateRows: 'repeat(2, 150px)'
							}}>
							{/* TODO make one */}
							{
								department ?
									<BoardCard
										boardList={boards}
										company={props.company}
										getSelectedBoard={props.getSelectedBoard}
									/> :
									<BoardCard
										boardList={props.boardList}
										company={props.company}
										getSelectedBoard={props.getSelectedBoard}
									/>
							}
						</div>
						: <p>No boards</p> : <Loading />}
					<div>
						{permit(props.company.role) ?
							<img
								onClick={() => setShowTaskBoardDialog(!showTaskBoardDialog)}
								src={addIcon}
								className={`fixed pointer ${showTaskBoardDialog ? 'dn' : 'db'}`}
								style={{
									bottom: '5rem',
									right: '7rem',
									width: '5rem',
									boxShadow: '0px 6px 6px #00000029',
									borderRadius: '50%'
								}}
							/>
							: undefined}
					</div>
				</div>
				{showTaskBoardDialog && (
					<RightSidebar
						onClose={() => setShowTaskBoardDialog(!showTaskBoardDialog)}
					>
						<FormBoard setShowTaskBoardDialog={setShowTaskBoardDialog} />
					</RightSidebar>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state: any) => {
	return {
		boardList: state.boardReducer.boardList,
		company: state.companyReducer.currentCompany
	};
};

export const BoardPage = connect(mapStateToProps,
	{ getAllBoards, getSelectedBoard, getAllDepartments })(withRouter(TaskPageComponent));
