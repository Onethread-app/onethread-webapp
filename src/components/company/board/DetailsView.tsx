import React, { useState } from 'react'
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { TaskManagementLayout } from './task/TaskManagementLayout';
import { connect } from 'react-redux';
import { TaskBoard } from 'stores/board/Reducer';
import { ColumnForm } from './task/ColumnForm';
import { TaskForm } from './task/TaskForm';
import { AddTeamMemberForm } from './task/AddTeamMemberForm';

interface BoardDetailsViewInternalProps {
  currentBoard?: TaskBoard;
}

const BoardDetailsViewComponent = (props: BoardDetailsViewInternalProps) => {

  const [showColumnFormDialog, setShowColumnFormDialog] = useState(false);
  const [showTaskFormDialog, setShowTaskFormDialog] = useState(false);
  const [showAddMemberFormDialog, setShowAddMemberFormDialog] = useState(false);

  return (
    <>
      <div className="flex mt3">
        <h1 className="f3 flex-grow-1 lh-title tigrow-lightGray-1 dib ma0">{props.currentBoard!.name}</h1>
        <Button
          className="grow fr h2 pointer white bp3-minimal mr2"
          style={props.currentBoard!.columns!.length > 0 ?
            {
              background: "#0fa3a3",
              outline: "none",
              color: 'white'
            } : {
              background: '#011b1b2e',
              outline: "none",
              color: 'white'
            }
          }
          text="Add Task"
          disabled={props.currentBoard!.columns!.length > 0 ? false : true}
          onClick={() => setShowTaskFormDialog(!showTaskFormDialog)}
        />
        <Button
          className="grow fr h2 pointer white bp3-minimal mr2"
          style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
          text="Add Column"
          onClick={() => setShowColumnFormDialog(!showColumnFormDialog)}
        />
        <Button 
          icon="new-person"
          text="Add member"
          intent={Intent.PRIMARY}
          minimal={true} 
          onClick={() => setShowAddMemberFormDialog(!showAddMemberFormDialog)}
        />
      </div>
      <div className="flex-auto">
        <div className="fl h-100 w-100">
          <TaskManagementLayout 
            columns={props.currentBoard!.columns!}
          />
        </div>
      </div>
      {showColumnFormDialog && (
        <Dialog
          onClose={() => setShowColumnFormDialog(!showColumnFormDialog)}
          title="Add Column"
          isOpen={showColumnFormDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <ColumnForm setShowColumnFormDialog={setShowColumnFormDialog} />
        </Dialog>
      )}
      {showTaskFormDialog && (
        <Dialog
          onClose={() => setShowTaskFormDialog(!showTaskFormDialog)}
          title="Create Task"
          isOpen={showTaskFormDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <TaskForm setShowTaskFormDialog={setShowTaskFormDialog} />
        </Dialog>
      )}
      {showAddMemberFormDialog && (
        <Dialog
          onClose={() => setShowAddMemberFormDialog(!showAddMemberFormDialog)}
          title="Add Team Member"
          isOpen={showAddMemberFormDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <AddTeamMemberForm setShowAddMemberFormDialog={setShowAddMemberFormDialog} />
        </Dialog>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
	return {
		currentBoard: state.taskManagementReducer.boardReducer.currentBoard
	}
}

export const BoardDetailsView = connect(mapStateToProps, null)(BoardDetailsViewComponent);
