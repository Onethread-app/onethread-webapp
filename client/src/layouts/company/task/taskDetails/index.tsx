import { useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import moment from 'moment';
import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { ITask } from 'stores/task/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { updateTask } from 'stores/task/Actions';

import attachFiles from 'resources/images/attachFiles.png';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

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
  updateTask: (task) => void;
}

const TaskDetailsComponent = (props: TaskDetailsInternalProps) => {
  const { t } = useTranslation();
  const [filePopover, setFilePopover] = useState(false);

  const openFilePopover = () => {
    setFilePopover(true);
  };

  return (
    <div className="w-100 ph2">
      <div className="w-100">
        <TaskTitleView currentTask={props.currentTask} />
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
          <div className="flex ml2">
            <CheckCircleOutlineIcon
              style={{
                width: '2rem',
                height: '2rem',
                color: props.currentTask.isCompleted
                  ? 'green'
                  : 'gray',
              }}
              className={`${
                props.currentTask.isCompleted ? '' : 'pointer'
              }`}
              onClick={() =>
                props.currentTask.isCompleted
                  ? null
                  : props.updateTask({
                      taskId: props.currentTask._id,
                      companyId: props.currentTask.company._id,
                      projectId: props.currentTask.project._id,
                      isCompleted: true,
                    })
              }
            />
          </div>
          <div className="flex justify-end ml-auto">
            {props.currentTask!.dueDate && (
              <>
                {Math.ceil(
                  moment(props.currentTask!.dueDate).diff(
                    moment(),
                    'days',
                    true,
                  ),
                ) === 0 ? (
                  <p className="fw6 red ml-auto mv2">
                    Deadline ends today
                  </p>
                ) : Math.ceil(
                    moment(props.currentTask!.dueDate).diff(
                      moment(),
                      'days',
                      true,
                    ),
                  ) < 0 ? (
                  <p className="fw6 red ml-auto mv2">Expired</p>
                ) : Math.ceil(
                    moment(props.currentTask!.dueDate).diff(
                      moment(),
                      'days',
                      true,
                    ),
                  ) === 1 ? (
                  <p className="fw6 mv2 flex ml-auto items-center">
                    <Icon
                      style={{
                        color: '#323030',
                      }}
                      icon={IconNames.TIME}
                      iconSize={12}
                      className="grow pointer pl2 pr2"
                    />{' '}
                    {Math.ceil(
                      moment(props.currentTask!.dueDate).diff(
                        moment(),
                        'days',
                        true,
                      ),
                    )}{' '}
                    day remaining
                  </p>
                ) : (
                  <p className="fw6  mv2 flex items-center">
                    <Icon
                      style={{
                        color: '#323030',
                      }}
                      icon={IconNames.TIME}
                      iconSize={12}
                      className="grow pointer pl2 pr2"
                    />{' '}
                    {Math.ceil(
                      moment(props.currentTask!.dueDate).diff(
                        moment(),
                        'days',
                        true,
                      ),
                    )}{' '}
                    days remaining
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-100">
        <div className="mv1">
          <TaskDescriptionView />
        </div>
        {isMobileOnly && (
          <div className="mv1">
            <ActivityView />
          </div>
        )}
        <div className="mv1">
          <SubTaskView />
        </div>
        <div className="mv1">
          <TaskFiles />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
    company: state.companyReducer.currentCompany,
    currentProjectId: state.projectReducer.projectDetails._id,
  };
};

export const TaskDetails = connect(mapStateToProps, {
  updateTask,
})(TaskDetailsComponent);
