import React, { useState } from 'react';
import { Button, Dialog, Icon } from '@blueprintjs/core';
import { TaskManagementLayout } from './TaskManagementLayout';
import { connect } from 'react-redux';
import { TaskBoard } from 'stores/board/Reducer';
import { ColumnForm } from './column/ColumnForm';
import { TaskForm } from './task/TaskForm';
import { AddTeamMemberForm } from './members/AddTeamMemberForm';
import { permit } from 'stores/UtilsActions';
import { CompanyModel } from 'stores/company/Reducer';
import { RightSidebar } from 'components/RightSidebar';

interface BoardDetailsViewInternalProps {
  currentBoard?: TaskBoard;
  company: CompanyModel;
}

const BoardDetailsViewComponent = (props: BoardDetailsViewInternalProps) => {

  const [showColumnFormDialog, setShowColumnFormDialog] = useState(false);
  const [showTaskFormDialog, setShowTaskFormDialog] = useState(false);
  const [showAddMemberFormDialog, setShowAddMemberFormDialog] = useState(false);
  const [showMemberListDialog, setShowMemberListDialog] = useState(false);

  return (
    <div className="br3 h-100 pa3 cf flex flex-column">
      <div className="flex">
        <div className="flex-auto">
          <h1 className="w-30 fw6 overflow-hidden f5"
            style={{
              height: '2.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
            {props.currentBoard!.name}
          </h1>
          <p
            className="mb0 f7 pointer dim"
            onClick={() => setShowMemberListDialog(!showMemberListDialog)}
          >
            {`Members: ${props.currentBoard!.members!.length}`}
          </p>
        </div>
        {permit(props.company.role) === true ?
          <>
            <Button
              className="grow fr h2 pointer white bp3-minimal mr3 outline-0"
              style={props.currentBoard!.columns!.length > 0 ?
                {
                  background: '#0fa3a3',
                  color: 'white'
                } : {
                  background: '#011b1b2e',
                  color: 'white'
                }
              }
              text={<span >Add Task</span>}
              disabled={props.currentBoard!.columns!.length > 0 ? false : true}
              onClick={() => setShowTaskFormDialog(!showTaskFormDialog)}
            />
            <Button
              className="grow fr h2 pointer white bp3-minimal mr3 outline-0"
              style={{
                background: '#00a8e8',
                color: 'white'
              }}
              text={<span >Add Column</span>}
              onClick={() => setShowColumnFormDialog(!showColumnFormDialog)}
            />
            <Button
              className="h2 outline-0"
              icon={
                <Icon
                  icon="new-person"
                  iconSize={17}
                  style={{ color: 'white' }}
                />
              }
              style={{
                background: '#f55b7f',
                color: 'white'
              }}
              onClick={() => setShowAddMemberFormDialog(!showAddMemberFormDialog)}
            />
          </>
          : undefined}
      </div>
      <div className="flex-auto">
        <div className="fl h-100 w-100">
          <TaskManagementLayout
            columns={props.currentBoard!.columns!}
          />
        </div>
      </div>
      {showColumnFormDialog && (
        <RightSidebar
          onClose={() => setShowColumnFormDialog(!showColumnFormDialog)}
        >
          <ColumnForm setShowColumnFormDialog={setShowColumnFormDialog} />
        </RightSidebar>
      )}
      {showTaskFormDialog && (
        <RightSidebar
          onClose={() => setShowTaskFormDialog(!showTaskFormDialog)}
        >
          <TaskForm setShowTaskFormDialog={setShowTaskFormDialog} />
        </RightSidebar>
      )}
      {showAddMemberFormDialog && (
        <Dialog
          onClose={() => setShowAddMemberFormDialog(!showAddMemberFormDialog)}
          title="Add Board Member"
          isOpen={showAddMemberFormDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <AddTeamMemberForm
            setShowAddMemberFormDialog={setShowAddMemberFormDialog}
            currentBoard={props.currentBoard!}
          />
        </Dialog>
      )}
      {showMemberListDialog && (
        <Dialog
          onClose={() => setShowMemberListDialog(!showMemberListDialog)}
          isOpen={showMemberListDialog}
          style={{ background: '#fff' }}
        >
          <div className="pa3">
            <h1 className="f4 tigrow-lightBlue">Board members</h1>
            <div>
              {props.currentBoard!.members!.length > 0 && props.currentBoard!.members!.map((member: any, i: number) => {
                return (
                  <article
                    key={member._id}
                    className={`flex items-center w-100 pv1 ${i !== props.currentBoard!.members!.length - 1 ? 'bb' : ''} b--black-05`}
                  >
                    <h1 className="f7 black mv0">{member.name}</h1>
                  </article>
                );
              })}
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentBoard: state.taskManagementReducer.boardReducer.currentBoard,
    company: state.companyReducer.currentCompany
  };
};

export const BoardDetailsView = connect(mapStateToProps, null)(BoardDetailsViewComponent);
