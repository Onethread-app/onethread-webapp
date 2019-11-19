import React, { useEffect, useState } from 'react'
import { Button, Card, Elevation, Dialog } from '@blueprintjs/core';
import { TaskBoard } from 'stores/board/Reducer';
import { connect } from 'react-redux';
import { Loading } from 'components/common/field/Loading';
import { Form } from './Form';
import { getAllBoards, getSelectedBoard } from 'stores/board/Actions';

interface BoardListViewProps {
  setBoardView: (val: number) => void
}

interface BoardListViewInternalProps extends BoardListViewProps {
  boardList: TaskBoard[];
  loading: boolean;
  getAllBoards: () => void;
  getSelectedBoard: (boardId: string | undefined) => void;
}

const BoardListViewComponent = (props: BoardListViewInternalProps) => {

  const [showTaskBoardDialog, setShowTaskBoardDialog] = useState(false);

  useEffect(() => {
    props.getAllBoards();
  }, [])

  return (
    <>
      <div>
        <h1 className="f5 lh-title tigrow-lightGray-1 dib">Task boards</h1>
        <Button 
          className="grow fr h2 pointer white bp3-minimal "
          style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
          onClick={() => setShowTaskBoardDialog(!showTaskBoardDialog)}
        >
          Create new board
        </Button>
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
                    await props.getSelectedBoard(board._id);
                    props.setBoardView(1);
                  }}
                >
                  <h5 className="mt0 mb2"><a href="!#">{board.name}</a></h5>
                  <p className="mb0">{board.description}</p>
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
    </>
  )
};

const mapStateToProps = (state: any) => {
  return {
    boardList: state.taskManagementReducer.boardReducer.boardList,
    loading: state.taskManagementReducer.boardReducer.loading
  }
}

export const BoardListView = connect(mapStateToProps, { getAllBoards, getSelectedBoard })(BoardListViewComponent);