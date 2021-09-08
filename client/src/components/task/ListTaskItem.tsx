import React, { useState, useEffect } from 'react';
import {
  // Link,
  useHistory,
  // useLocation,
} from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { Menu } from '@blueprintjs/core/lib/esm/components/menu/menu';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { ButtonGroup } from '@blueprintjs/core/lib/esm/components/button/buttonGroup';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ForumIcon from '@material-ui/icons/Forum';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

import { IColumn, ITask } from 'stores/task/Reducer';
import {
  dragAndDropTask,
  deleteTask,
  ITaskDelete,
  getSelectedTaskDetails,
} from 'stores/task/Actions';

import DueDate from './DueDate';
import Timer from 'components/timer/Timer';
import TaskPriorityTag from './TaskPriorityTag';
import MemberGroup from 'components/member/MemberGroup';

const TaskItemContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem;
  max-height: 56px;
  height: 56px;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  color: #182026 !important;

  &:first-child {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }

  &:hover {
    background: #f5f8fa;
  }
`;

const TaskPortion = styled.div`
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }

  &:first-child {
    width: 27%;
    display: flex;
    align-items: center;
  }

  &:nth-child(2) {
    width: 5% !important;
  }

  &:not(:first-child) {
    width: 13%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:last-child {
    width: 3%;
    justify-content: flex-end !important;
  }
`;

const TagSelect = styled.select`
  background-color: ${(props) =>
    props.status === 'done'
      ? '#2EB67D'
      : props.status === 'in-progress'
      ? '#08A0F7'
      : '#FFA800'};
  color: #f5f8fa;
  text-align-last: center;
  border: none;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  margin: 0;
  width: auto;
  max-width: 115px;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
`;

interface ISelectOption {
  value: string;
  label: string;
}

interface IListTaskItemProps {
  task: ITask;
}

interface IListTaskItemInternalProps extends IListTaskItemProps {
  columns: IColumn[];
  deletingTask: boolean;
  errorOnTaskDelete: string;
  fetchingTask: boolean;
  taskError: string;
  uniqueCompanyName: string;
  companyId: string;
  projectId: string;
  dragAndDropTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    taskIndexOfDestinationColumn: number,
  ) => void;
  deleteTask: ({ taskId, columnId }: ITaskDelete) => void;
  getSelectedTaskDetails: (task: string) => void;
}

const ListTaskItem = (props: IListTaskItemInternalProps) => {
  const { task, columns } = props;
  const history = useHistory();
  // const location = useLocation();
  const [tick, setTick] = useState(false);
  const [statusOptions, setStatusOptions] = useState<ISelectOption[]>(
    [],
  );
  const [selectedOption, setSelectedOption] = useState<ISelectOption>(
    {
      value: task.columnId,
      label: task.status.toLowerCase().split('-').join(' '),
    },
  );
  const [taskDelete, setTaskDelete] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);

  const handleClick = () => {
    props.getSelectedTaskDetails(task._id);
    setLoading(true);
  };

  const handleTick = (e) => {
    e.stopPropagation();
    if (task.status !== 'done') {
      setTick(!tick);
      const doneCol = columns.filter(
        (col) => col.name.toLowerCase() === 'done',
      );
      props.dragAndDropTask(
        task._id,
        task.columnId,
        doneCol[0]._id,
        0,
      );
    }
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleStatusChange = (e) => {
    const selected = statusOptions.filter(
      (op) => op.value === e.target.value,
    );
    if (selected[0]) {
      setSelectedOption(selected[0]);
      props.dragAndDropTask(
        task._id,
        task.columnId,
        e.target.value,
        0,
      );
    }
  };

  const handleTaskDelete = () => {
    const payload = { taskId: task._id, columnId: task.columnId };
    props.deleteTask(payload);
    setDeletingTask(true);
  };

  useEffect(() => {
    setSelectedOption((prev) => {
      return {
        ...prev,
        label: task.status.toLowerCase().split('-').join(' '),
      };
    });
    if (task.status === 'done') {
      setTick(true);
    } else setTick(false);
  }, [task.status]);

  useEffect(() => {
    setSelectedOption((prev) => {
      return {
        ...prev,
        value: task.columnId,
      };
    });
  }, [task.columnId]);

  useEffect(() => {
    if (columns) {
      const statusFromColumnName = columns.map((col) => {
        return {
          value: col._id,
          label: col.name,
        };
      });
      setStatusOptions(statusFromColumnName);
    }
  }, [columns]);

  useEffect(() => {
    if (
      loading === true &&
      props.fetchingTask === false &&
      props.taskError === ''
    ) {
      history.push(
        `/company/${props.uniqueCompanyName}/project/${props.projectId}/board/${task.boardId}/task/${task._id}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, props.fetchingTask, props.taskError]);

  useEffect(() => {
    if (
      deletingTask === true &&
      props.deletingTask === false &&
      props.errorOnTaskDelete === ''
    ) {
      setTaskDelete(false);
      setShowPopover(false);
    }
  }, [deletingTask, props.deletingTask, props.errorOnTaskDelete]);

  return (
    // <Link
    //   to={{
    //     pathname: `/task/${task._id}`,
    //     state: { background: location },
    //   }}
    // >
    <>
      <TaskItemContainer onClick={handleClick}>
        <TaskPortion>
          <Icon
            icon={tick ? 'tick-circle' : 'circle'}
            iconSize={16}
            className="mr4 pointer"
            color={tick ? '#2EB67D' : 'inherit'}
            style={{
              cursor: task.status === 'done' ? 'no-drop' : 'pointer',
            }}
            onClick={handleTick}
          />
          <h3 className="truncate pr3">{task.name}</h3>
        </TaskPortion>
        <TaskPortion>
          <div className={`flex`}>
            <ForumIcon
              fontSize="small"
              style={{ color: '#a4a4a4' }}
            />{' '}
            <sup className="mt1" style={{ color: '#a4a4a4' }}>
              {task.activityCount ? task.activityCount : 0}
            </sup>
          </div>
        </TaskPortion>
        <TaskPortion>
          <TaskPriorityTag priority={task.priority} />
        </TaskPortion>
        <TaskPortion>
          <TagSelect
            name="status"
            id="boardTagStatus"
            status={selectedOption.label
              .toLowerCase()
              .split(' ')
              .join('-')}
            onClick={handleStatusClick}
            onChange={handleStatusChange}
            value={selectedOption.value}
          >
            {statusOptions.map((op) => (
              <option value={op.value} key={op.value}>
                {op.label}
              </option>
            ))}
          </TagSelect>
        </TaskPortion>
        <TaskPortion>
          {task.dueDate ? (
            <DueDate dueDate={task.dueDate} />
          ) : (
            <p>Not set</p>
          )}
        </TaskPortion>
        <TaskPortion>
          <Timer
            task={task}
            list
            companyId={props.companyId}
            projectId={props.projectId}
          />
        </TaskPortion>
        <TaskPortion>
          {task.assignedMembers &&
            task.assignedMembers.length > 0 && (
              <MemberGroup members={task.assignedMembers} small />
            )}
        </TaskPortion>
        <TaskPortion>
          <Popover
            isOpen={showPopover}
            content={
              <ClickAwayListener
                onClickAway={() => setShowPopover(false)}
              >
                <Menu>
                  <MenuItem
                    text="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTaskDelete(true);
                    }}
                  />
                </Menu>
              </ClickAwayListener>
            }
            target={
              <MoreVertIcon
                htmlColor="#a1a1a1"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowPopover(!showPopover);
                }}
              />
            }
          />
        </TaskPortion>
      </TaskItemContainer>
      <Dialog
        isOpen={taskDelete}
        onClose={() => setTaskDelete(false)}
        canOutsideClickClose={true}
        canEscapeKeyClose={true}
        className="pa0"
      >
        <div
          className="flex justify-around items-center w-100 ba bw1 br2"
          style={{ borderColor: '#F55B7F' }}
        >
          {props.deletingTask === true ? (
            <div className="flex items-center justify-center">
              <CircularProgress
                color="secondary"
                size={16}
                className="mr3"
              />
              <h3>Deleting</h3>
            </div>
          ) : props.errorOnTaskDelete === '' ? (
            <>
              <h4 className="fw5 f5 flex items-center">
                <Icon
                  icon="info-sign"
                  intent="primary"
                  style={{ marginRight: '.5rem' }}
                />
                Are you sure?
              </h4>
              <ButtonGroup minimal={true}>
                <Button
                  icon="undo"
                  onClick={() => {
                    setTaskDelete(false);
                    setShowPopover(false);
                  }}
                  intent="primary"
                >
                  No, Keep it
                </Button>
                <Button
                  icon="trash"
                  intent="danger"
                  onClick={handleTaskDelete}
                >
                  Yes, Delete
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <h3 className="fw5 flex items-center tc">
              {props.errorOnTaskDelete}
            </h3>
          )}
        </div>
      </Dialog>
    </>
    // </Link>
  );
};

const mapStateToProps = (state: any) => ({
  columns: state.taskIndexReducer.taskReducer.currentBoard.columns,
  deletingTask: state.taskIndexReducer.taskReducer.deletingTask,
  errorOnTaskDelete:
    state.taskIndexReducer.taskReducer.errorOnTaskDelete,
  fetchingTask: state.taskIndexReducer.taskReducer.fetchingTask,
  taskError: state.taskIndexReducer.taskReducer.taskError,
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
  companyId: state.companyReducer.currentCompany._id,
  projectId: state.projectReducer.projectDetails._id,
});

export default connect(mapStateToProps, {
  dragAndDropTask,
  deleteTask,
  getSelectedTaskDetails,
})(ListTaskItem);
