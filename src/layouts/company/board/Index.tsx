import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from 'react-router';
import { TaskBoard } from 'stores/board/Reducer';
import { CompanyModel } from 'stores/company/Reducer';
import { permit } from 'stores/UtilsActions';
import { Button, Card, Elevation, Dialog } from '@blueprintjs/core';
import { Loading } from 'components/Loading';
import { Form } from './Form';
import { connect } from 'react-redux';
import { getAllBoards, getSelectedBoard } from 'stores/board/Actions';

interface BoardListViewInternalProps {
	boardList: TaskBoard[];
	loading: boolean;
	company: CompanyModel;
	getAllBoards: () => void;
	getSelectedBoard: (boardId: string | undefined) => Promise<number>;
}

const TaskPageComponent = (props: BoardListViewInternalProps & RouteComponentProps) => {

	const [showTaskBoardDialog, setShowTaskBoardDialog] = useState(false);

	useEffect(() => {
		props.getAllBoards();
	}, []);

	return (
		<div className="pa4 h-100">
			<div className="br3 bg-white h-100 pa4 cf flex flex-column">
				<div>
					<h1 className="f5 lh-title tigrow-lightGray-1 dib">Task boards</h1>
					{permit(props.company.role) ?
						<Button
							className="grow fr h2 pointer white bp3-minimal "
							style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
							onClick={() => setShowTaskBoardDialog(!showTaskBoardDialog)}
						>
							Create new board
        			</Button>
						: undefined}
				</div>
				<div className="fl w-100 flex-grow-1 overflow-auto">
					{props.loading === false ? props.boardList.length > 0 ?
						<div className="cf ph2-ns flex flex-wrap">
							{props.boardList.map(board => (
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
									>
										<h5 className="mt0 mb2 ws-break"><a href="!#">{board.name}</a></h5>
										<p className="mb0 ws-break">
											{board.description}
										</p>
									</Card>
								</div>
							))}
						</div>
						: <p>No boards</p> : <Loading />}
				</div>
				{showTaskBoardDialog && (
					<Dialog
						onClose={() => setShowTaskBoardDialog(!showTaskBoardDialog)}
						title="Add Board"
						isOpen={showTaskBoardDialog}
						style={{ background: '#fff' }}
						canOutsideClickClose={false}
					>
						<Form setShowTaskBoardDialog={setShowTaskBoardDialog} />
					</Dialog>
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
  }
}

export const TaskPage = connect(mapStateToProps, { getAllBoards, getSelectedBoard })(withRouter(TaskPageComponent));
