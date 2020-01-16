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

interface IBoardCardComponent {
	boardList: TaskBoard[];
	company: CompanyModel;
	// color: string[];
	getSelectedBoard: (boardId: string | undefined) => Promise<number>;
}

const BoardCard = withRouter((props: IBoardCardComponent & RouteComponentProps) => (
	<>
		{props.boardList.map((board) => (
			<div className="fl w-100 w-25-ns pa2">
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
							borderLeft: `5px solid ${
								find(boardColor , ['code', board.color]) ? find(boardColor , ['code', board.color])!.value : 'white'}`,
							// borderLeft: `5px solid ${board.color}`,
							paddingLeft: '20px',
							marginLeft: '-2px',
							borderRadius: '3px'
						}}
					>
						<h3 className="mt0 mb2 ws-break flex-grow-1 ws-normal"
							style={{
								height: '35px',
								fontWeight: 600,
								fontSize: '15px',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}>
							<a style={{ color: 'black' }} href="!#">{board.name}</a></h3>
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
							<p className="fw8">18</p>
						</div>
						<div>
							<p className="mb0 ws-break" style={{ fontSize: '0.7rem' }}>
								Total Members
				</p>
							<p className="fw8">5</p>
						</div>
					</div>

				</Card>
			</div>
		))}
	</>
));

interface IBoardListViewInternalProps {
	boardList: TaskBoard[];
	loading: boolean;
	company: CompanyModel;
	getAllBoards: () => void;
	getAllDepartments: () => void;
	getSelectedBoard: (boardId: string | undefined) => Promise<number>;
}

const TaskPageComponent = (props: IBoardListViewInternalProps & RouteComponentProps) => {

	const [showTaskBoardDialog, setShowTaskBoardDialog] = useState(false);

	useEffect(() => {
		props.getAllBoards();
		props.getAllDepartments();
	}, []);

	const [department, setDepartment] = useState('');
	const boards = props.boardList.filter((board) => board.department === department);
	// const colors = ['#FA617F', '#A8D16B', '#FFD7D0', '#FE5E41', '#3F61C5', '#11B468', '#5A1DD6'];

	return (
		<div className="h-100">
			<div className="br3 bg-white h-100 pa4 cf flex flex-column">
				<div className="pl2 flex" style={{ justifyContent: 'space-between' }}>
					<h2 className="f5 lh-title tigrow-lightGray-1 dib">Board</h2>
					<div className="flex">
					<p className="mt3 pr3">Filter By</p>
					<div className="mt2" style={{ width: '200px' }}>
						<HTMLSelect
							fill={true}
							minimal={true}
							onChange={(event: any) => {
								setDepartment(event.currentTarget.value);
							}}
							className="bp3-elevation-2"
							style={{
								boxShadow: 'none',
								borderRadius: '0px',
								backgroundColor: 'white',
								flex: '1',
								outline: 'none',

							}}
						>
							<option selected value="">
								All
							</option>
							{
								props.company.departments ?
									props.company.departments.map((d) => (
										<option value={d._id}>{d.name}</option>
									))
									: undefined
							}
						</HTMLSelect>
					</div>
					</div>
				</div>
				<div>
					{permit(props.company.role) ?
						<Button
							className="grow fr h2 pointer white bp3-minimal "
							style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
							onClick={() => setShowTaskBoardDialog(!showTaskBoardDialog)}
						>
							Create new board
						</Button>
						: undefined}
				</div>
				<p className="pl2 mt3">My Boards</p>
				<div className="fl w-100 flex-grow-1 overflow-auto">
					{props.loading === false ? props.boardList.length > 0 ?
						<div className="cf flex flex-wrap">
							{/* TODO make one */}
							{
								department ?
									<BoardCard
										boardList={boards}
										company={props.company}
										getSelectedBoard={props.getSelectedBoard}
										// color={colors}
									/> :
									<BoardCard
										boardList={props.boardList}
										company={props.company}
										getSelectedBoard={props.getSelectedBoard}
										// color={colors}
									/>
							}
						</div>
						: <p>No boards</p> : <Loading />}
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
		boardList: state.taskManagementReducer.boardReducer.boardList,
		loading: state.taskManagementReducer.boardReducer.loading,
		company: state.companyReducer.currentCompany
	};
};

export const TaskPage = connect(mapStateToProps,
	{ getAllBoards, getSelectedBoard, getAllDepartments })(withRouter(TaskPageComponent));
