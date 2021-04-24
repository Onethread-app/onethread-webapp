import React, { useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { TaskManagementLayout } from './TaskManagementLayout';
import { connect } from 'react-redux';
import { TaskBoard } from 'stores/board/Reducer';
import { AddTeamMemberForm } from './members/AddTeamMemberForm';
import { ICompany } from 'stores/company/Reducer';
import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import addMemberIcon from 'resources/images/addMemberIcon.png';
import { IProject } from 'stores/project/Reducer';
import { projectRules } from '../project/settings/projectrules';
import { RightSidebar } from 'components/RightSidebar';
import { FormBoard } from '../board/Form';
import { ColumnForm } from './column/ColumnForm';

interface BoardDetailsViewInternalProps {
  currentBoard?: TaskBoard;
  company: ICompany;
  currentProject?: IProject;
  role: string;
  optionalRole: any;
}

const BoardDetailsViewComponent = (
  props: BoardDetailsViewInternalProps,
) => {
  const [
    showAddMemberFormDialog,
    setShowAddMemberFormDialog,
  ] = useState(false);
  const [showMemberListDialog, setShowMemberListDialog] = useState(
    false,
  );
  const [showTaskBoardDialog, setShowTaskBoardDialog] = useState(
    false,
  );
  const [showColumnFormDialog, setShowColumnFormDialog] = useState(
    false,
  );
  const permissions = projectRules(props.role, props.optionalRole);

  return (
    <div
      className="br3 h-100 ph3 cf flex flex-column"
      style={{ background: 'white' }}
    >
      <div className="flex mt2">
        <BreadCrumbs
          items={[
            {
              text: `Board`,
              href: `/company/${props.company.uniqueName}/project/${
                props.currentProject!._id
              }/board`,
            },
            {
              text: `${props.currentBoard!.name}`,
              href: `/company/${props.company.uniqueName}/board/${
                props.currentBoard!._id
              }`,
            },
          ]}
        />
      </div>
      <div
        className="flex items-center mt3 mb4"
        style={{ justifyContent: 'space-between' }}
      >
        <h3 className="w-100 ma0 f3">{props.currentBoard!.name}</h3>
        <div className="flex mh3-ns w-100 w-auto-ns">
          {permissions.grantAll ||
          permissions.projectModerator.includes(
            'createUpdateBoard',
          ) ? (
            <>
              <button
                className="mb0 mr2 pointer f5 f6-ns br2 ba b--black pa1"
                style={{ minWidth: '130px', background: 'inherit' }}
                onClick={() => setShowColumnFormDialog(true)}
              >
                Add New Column
              </button>
              <button
                className="mb0 mr2 pointer f5 f6-ns bn white br2 pa1"
                style={{ minWidth: '130px', background: '#3F61C5' }}
                onClick={() => setShowTaskBoardDialog(true)}
              >
                Create New Board
              </button>
              <img
                className="br2 pointer"
                style={{ height: '1.8rem', width: '1.8rem' }}
                src={addMemberIcon}
                alt="Add Member Icon"
                onClick={() =>
                  setShowAddMemberFormDialog(!showAddMemberFormDialog)
                }
              />
            </>
          ) : permissions.grantAll ||
            permissions.projectModerator.includes(
              'assignDeleteMemberBoard',
            ) ? (
            <>
              <img
                className="br2 pointer"
                style={{ height: '1.8rem', width: '1.8rem' }}
                src={addMemberIcon}
                alt="Add Member Icon"
                onClick={() =>
                  setShowAddMemberFormDialog(!showAddMemberFormDialog)
                }
              />
            </>
          ) : undefined}
        </div>
      </div>
      <div className="flex-auto">
        <div className="fl h-100 w-100">
          <TaskManagementLayout
            columns={props.currentBoard!.columns!}
          />
        </div>
      </div>
      {showAddMemberFormDialog && (
        <Dialog
          onClose={() =>
            setShowAddMemberFormDialog(!showAddMemberFormDialog)
          }
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
          onClose={() =>
            setShowMemberListDialog(!showMemberListDialog)
          }
          isOpen={showMemberListDialog}
          style={{ background: '#fff' }}
        >
          <div className="pa3">
            <h1 className="f4 tigrow-lightBlue">Board members</h1>
            <div>
              {props.currentBoard!.members!.length > 0 &&
                props.currentBoard!.members!.map(
                  (member: any, i: number) => {
                    return (
                      <article
                        key={member._id}
                        className={`flex items-center w-100 pv1 ${
                          i !==
                          props.currentBoard!.members!.length - 1
                            ? 'bb'
                            : ''
                        } b--black-05`}
                      >
                        <h1 className="f7 black mv0">
                          {member.name}
                        </h1>
                      </article>
                    );
                  },
                )}
            </div>
          </div>
        </Dialog>
      )}
      {showTaskBoardDialog && (
        <RightSidebar
          onClose={() => setShowTaskBoardDialog(!showTaskBoardDialog)}
        >
          <FormBoard
            setShowTaskBoardDialog={setShowTaskBoardDialog}
          />
        </RightSidebar>
      )}
      {showColumnFormDialog && (
        <RightSidebar
          onClose={() =>
            setShowColumnFormDialog(!showColumnFormDialog)
          }
        >
          <ColumnForm
            setShowColumnFormDialog={setShowColumnFormDialog}
          />
        </RightSidebar>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentBoard: state.boardIndexReducer.boardReducer.currentBoard,
    company: state.companyReducer.currentCompany,
    currentProject: state.projectReducer.projectDetails,
    role:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.role,
    optionalRole:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.project.optionalRole,
  };
};

export const BoardDetailsView = connect(
  mapStateToProps,
  null,
)(BoardDetailsViewComponent);
