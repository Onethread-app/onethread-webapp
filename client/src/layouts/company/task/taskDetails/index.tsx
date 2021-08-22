import React, { useState } from 'react';
import { ITask } from 'stores/board/Reducer';
import { connect } from 'react-redux';
import { TaskTitleView } from './TaskTitle/TaskTitleView';
import { TaskDescriptionView } from './TaskDescription/TaskDescriptionView';
import { Popover } from '@blueprintjs/core';
// import { AssignedMembersEditor } from './AssignedMembers/AssignedMembersEditor';
// import addMembers from 'resources/images/addMembers.png';
import attachFiles from 'resources/images/attachFiles.png';
import { ICompany } from 'stores/company/Reducer';
import TaskFiles from './Files/TaskFiles';
import TaskFilesAttach from './Files/TaskFilesAttach';
import { useTranslation } from 'react-i18next';
import { SubTaskView } from '../subTask/SubtaskView';
import AddSubTaskButton from '../subTask/AddSubtaskButton';

interface TaskDetailsInternalProps {
  currentTask?: ITask;
  company?: ICompany;
}

const TaskDetailsComponent = (props: TaskDetailsInternalProps) => {
  const { t } = useTranslation();

  // const [membersPopover, setMembersPopover] = useState(false);
  const [filePopover, setFilePopover] = useState(false);

  // const openMembersPopOver = () => {
  //   setMembersPopover(true);
  //   setFilePopover(false);
  // };

  const openFilePopover = () => {
    setFilePopover(true);
  };

  return (
    <div
      className="w-100 ph2"
      style={{ maxHeight: '650px', overflowY: 'auto' }}
    >
      <div className="w-100">
        <TaskTitleView />
      </div>
      <div className="w-100">
        <div className="flex justify-start">
          <div className="mr3">
            <Popover
              isOpen={filePopover}
              content={
                <TaskFilesAttach setFilePopover={setFilePopover} />
              }
              target={
                <div
                  onClick={openFilePopover}
                  className="flex br2 mb2 pt2 ph3 pointer"
                  style={{
                    width: '100%',
                    color: '#5A5A5A',
                    border: '1px solid #B1B1B1',
                  }}
                >
                  <img
                    style={{ height: '15px' }}
                    src={attachFiles}
                    alt=""
                  />
                  <p className="pl3 f7">
                    {t('app.project.Project-boards.Attach-Files')}
                  </p>
                </div>
              }
            />
          </div>
          {/* <div className="mr3">
            {props.company ? (
              <Popover
                isOpen={membersPopover}
                content={
                  <div className="pa3 cf bg-white">
                    <AssignedMembersEditor
                      setMembersPopover={setMembersPopover}
                    />
                  </div>
                }
                target={
                  <div
                    className="flex br2 mb2 pt2 ph3 pointer"
                    style={{
                      width: '100%',
                      color: '#5A5A5A',
                      border: '1px solid #B1B1B1',
                    }}
                    onClick={openMembersPopOver}
                  >
                    <img
                      style={{ height: '15px' }}
                      src={addMembers}
                      alt=""
                    />
                    <p className="pl3 f7">
                      {t('app.project.Project-boards.Members')}
                    </p>
                    <p className="pl3 f7">Members</p>
                  </div>
                }
              />
            ) : undefined}
          </div> */}
          <div>
            <div>
              <AddSubTaskButton />
            </div>
          </div>
        </div>
      </div>
      <div className="w-100">
        <div className="mv2">
          <TaskDescriptionView />
        </div>
        <div className="mv3">
          <SubTaskView />
        </div>
        <div className="mv3">
          <TaskFiles />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
    company: state.companyReducer.currentCompany,
  };
};

export const TaskDetails = connect(
  mapStateToProps,
  null,
)(TaskDetailsComponent);
