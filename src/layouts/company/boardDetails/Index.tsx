import React, { useState } from 'react';
import { Button, Dialog, Popover } from '@blueprintjs/core';
import { TaskManagementLayout } from './TaskManagementLayout';
import { connect } from 'react-redux';
import { TaskBoard } from 'stores/board/Reducer';
import { ColumnForm } from './column/ColumnForm';
import { TaskForm } from './task/TaskForm';
import { AddTeamMemberForm } from './members/AddTeamMemberForm';
import { permit } from 'stores/UtilsActions';
import { CompanyModel } from 'stores/company/Reducer';
import { RightSidebar } from 'components/RightSidebar';
import { BreadCrumbs } from 'components/fields/Breadcrumbs';

import addIcon from 'resources/images/addIcon.png';
import taskIcon from 'resources/images/taskIcon.png';
import columnIcon from 'resources/images/columnIcon.png';
// import settingIcon from 'resources/images/settingIcon.png';
import addMemberIcon from 'resources/images/addMemberIcon.png';

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
    <div
      className="br3 h-100 ph3 cf flex flex-column"
      style={{ background: 'white' }}
    >
      <div className="flex">
        <BreadCrumbs
          items={[
            { text: `Board`, href: `/company/${props.company.name}/board` },
            { text: `${props.currentBoard!.name}`, href: `/company/${props.company.name}/board/${props.currentBoard!._id}` }
          ]}
        />
      </div>
      <div
        className="flex items-center mt3 mb4"
        style={{ justifyContent: 'space-between' }}
      >
        <h3 className="w-100 ma0 f3">
          {props.currentBoard!.name}
        </h3>
        <div className="flex mh3">
          {permit(props.company.role) === true ?
            <>
              {/* <img
                className="mr3 br2 pointer"
                style={{ height: '1.8rem', width: '1.8rem' }}
                src={settingIcon}
                alt="Setting icon"
              /> */}
              <img
                className="br2 pointer"
                style={{ height: '1.8rem', width: '1.8rem' }}
                src={addMemberIcon}
                alt="Add Member Icon"
                onClick={() => setShowAddMemberFormDialog(!showAddMemberFormDialog)}
              />
            </>
            : undefined}
        </div>
      </div>
      {permit(props.company.role) === true ?
        <div
          className="fixed"
          style={{
            bottom: '10rem',
            right: '8rem',
          }}
        >
          <Popover
            minimal={true}
            content={
              <div className={`pa3 ${showTaskFormDialog || showColumnFormDialog ? 'dn' : 'db'}`}>
                <div className="mb2">
                  <Button
                    className="grow h2 pointer white bp3-minimal flex outline-0"
                    text={<span className="fw8">Add Task</span>}
                    icon={
                      <img
                        style={{ height: '25px', paddingRight: '1rem' }}
                        src={taskIcon}
                      />
                    }
                    disabled={props.currentBoard!.columns!.length > 0 ? false : true}
                    onClick={() => setShowTaskFormDialog(!showTaskFormDialog)}
                  />
                </div>
                <div>
                  <Button
                    className="grow h2 pointer white bp3-minimal flex outline-0"
                    text={<span className="fw8" >Add Column</span>}
                    icon={
                      <img
                        style={{ height: '25px', paddingRight: '1rem' }}
                        src={columnIcon}
                      />
                    }
                    onClick={() => setShowColumnFormDialog(!showColumnFormDialog)}
                  />
                </div>
              </div>
            }
            target={
              <div className={`${showTaskFormDialog || showColumnFormDialog ? 'dn' : 'db'}`}>
                <img
                  src={addIcon}
                  className="fixed pointer"
                  style={{
                    bottom: '2.2rem',
                    right: '7rem',
                    width: '4rem',
                    boxShadow: '0px 3px 6px #00000029',
                    borderRadius: '50%'
                  }}
                />
              </div>
            }
          />
        </div> : undefined}
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
