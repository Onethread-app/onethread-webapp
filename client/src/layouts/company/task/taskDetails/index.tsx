import React, { useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { ITask } from 'stores/board/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { connect } from 'react-redux';
import { Popover } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
// import { AssignedMembersEditor } from './AssignedMembers/AssignedMembersEditor';
// import addMembers from 'resources/images/addMembers.png';
import attachFiles from 'resources/images/attachFiles.png';
import TaskFiles from './Files/TaskFiles';
import TaskFilesAttach from './Files/TaskFilesAttach';
import { SubTaskView } from '../subTask/SubtaskView';
import AddSubTaskButton from '../subTask/AddSubtaskButton';
import Timer from 'components/timer/Timer';
import { ActivityView } from '../activity/ActivityView';
import { TaskTitleView } from './TaskTitle/TaskTitleView';
import { TaskDescriptionView } from './TaskDescription/TaskDescriptionView';

interface TaskDetailsInternalProps {
  currentTask: ITask;
  company: ICompany;
  currentProjectId: string;
}

const TaskDetailsComponent = (props: TaskDetailsInternalProps) => {
  const [filePopover, setFilePopover] = useState(false);
  const { t } = useTranslation();

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
          <div className="mr3">
            <AddSubTaskButton />
          </div>
          <div>
            <Timer
              task={props.currentTask}
              companyId={props.company._id}
              projectId={props.currentProjectId}
            />
          </div>
        </div>
      </div>
      <div className="w-100">
        <div className="mv3">
          <TaskDescriptionView />
        </div>
        {isMobileOnly && (
          <div className="mv3">
            <ActivityView />
          </div>
        )}
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
    currentProjectId: state.projectReducer.projectDetails._id,
  };
};

export const TaskDetails = connect(mapStateToProps)(
  TaskDetailsComponent,
);
