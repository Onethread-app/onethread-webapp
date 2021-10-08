import { useState, useEffect } from 'react';
import {
  useHistory,
  // useLocation,
  // Link,
} from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { find } from 'lodash';

import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { Menu } from '@blueprintjs/core/lib/esm/components/menu/menu';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { ButtonGroup } from '@blueprintjs/core/lib/esm/components/button/buttonGroup';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import ForumIcon from '@material-ui/icons/Forum';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

import { ITask } from 'stores/task/Reducer';
import {
  getSelectedTaskDetails,
  deleteTask,
  ITaskDelete,
} from 'stores/task/Actions';
import { priorityColor } from 'stores/UtilsActions';

import DueDate from './DueDate';
import TaskPriorityTag from './TaskPriorityTag';
import MemberGroup from 'components/member/MemberGroup';

const ThirdRow = styled.div`
  overflow: hidden;
  height: 0;
  transition: all 0.3s ease-in;
  transition-delay: 0.4s;
`;

const SecondRow = styled.div`
  overflow: hidden;
  height: 0;
  transition: all 0.3s ease-in;
  transition-delay: 0.4s;
`;

const TaskDueDate = styled.div`
  font-size: 0.75rem;
  line-height: 140%;
  color: #a4a4a4;
  margin-right: 0.75rem;
`;

const TaskItemName = styled.h3`
  font-size: 1rem;
  line-height: 38px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
`;

const TaskItemContainer = styled.div`
  width: 235px;
  padding: 1rem 1.25rem;
  border-radius: 5px;
  box-shadow: ${(props) => `
  rgba(17, 17, 26, 0.05) 0px 1px 0px, ${
    props.isDragging
      ? '#3484F0'
      : find(priorityColor, ['code', props.priority])!.value
  } 0px 0px 4px`};
  background-color: #fff;
  color: #182026 !important;
  display: flex;
  flex-direction: column;

  &:hover ${SecondRow} {
    height: 37px;
  }

  &:hover ${ThirdRow} {
    height: 37px;
  }
`;

interface IColumnTaskItem {
  index: number;
  task: ITask;
}

interface IColumnTaskItemInternalProps extends IColumnTaskItem {
  fetchingTask: boolean;
  taskError: string;
  uniqueCompanyName: string;
  projectId: string;
  deletingTask: boolean;
  errorOnTaskDelete: string;
  getSelectedTaskDetails: (task: string) => void;
  deleteTask: ({ taskId, columnId }: ITaskDelete) => void;
}

const ColumnTaskItem = (props: IColumnTaskItemInternalProps) => {
  const { task } = props;
  const history = useHistory();
  // const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [taskDelete, setTaskDelete] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);

  const handleClick = () => {
    props.getSelectedTaskDetails(task._id);
    setLoading(true);
  };

  const handleTaskDelete = () => {
    const payload = { taskId: task._id, columnId: task.columnId };
    props.deleteTask(payload);
    setDeletingTask(true);
  };

  useEffect(() => {
    if (
      loading === true &&
      props.fetchingTask === false &&
      props.taskError === ''
    ) {
      setLoading(false);
      history.push(
        `/company/${props.uniqueCompanyName}/project/${props.projectId}/board/${task.boardId}/task/${task._id}`,
      );
    }
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
    <>
      <Draggable draggableId={task._id} index={props.index}>
        {(provided, snapshot) => {
          const allowedProps = { ref: provided.innerRef };
          return (
            // <Link
            //   to={{
            //     pathname: `/task/${task._id}`,
            //     state: { background: location },
            //   }}
            // >
            <TaskItemContainer
              className={`mh2 w-100`}
              priority={task.priority}
              isDragging={snapshot.isDragging}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              {...allowedProps}
              onClick={handleClick}
            >
              <div className="flex justify-between items-center">
                <TaskItemName title={task.name}>
                  {task.name}
                </TaskItemName>
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
                      htmlColor="#182026"
                      fontSize="small"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowPopover(!showPopover);
                      }}
                    />
                  }
                />
              </div>
              <SecondRow className={`flex  items-center`}>
                <TaskDueDate>
                  {task.dueDate ? (
                    <DueDate dueDate={task.dueDate} />
                  ) : (
                    <p className="mb0">No Due Date</p>
                  )}
                </TaskDueDate>
                <div className={`flex`}>
                  <ForumIcon
                    fontSize="small"
                    style={{ color: '#a4a4a4' }}
                  />{' '}
                  <sup className="mt1" style={{ color: '#a4a4a4' }}>
                    {task.activityCount ? task.activityCount : 0}
                  </sup>
                </div>
              </SecondRow>
              <ThirdRow
                className={`flex justify-between items-center`}
              >
                <TaskPriorityTag priority={task.priority} />
                {task.assignedMembers &&
                  task.assignedMembers.length > 0 && (
                    <MemberGroup
                      members={task.assignedMembers}
                      small
                    />
                  )}
              </ThirdRow>
            </TaskItemContainer>
            // </Link>
          );
        }}
      </Draggable>
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
  );
};

const mapStateToProps = (state: any) => ({
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
  projectId: state.projectReducer.projectDetails._id,
  fetchingTask: state.taskIndexReducer.taskReducer.fetchingTask,
  taskError: state.taskIndexReducer.taskReducer.taskError,
  deletingTask: state.taskIndexReducer.taskReducer.deletingTask,
  errorOnTaskDelete:
    state.taskIndexReducer.taskReducer.errorOnTaskDelete,
});

export default connect(mapStateToProps, {
  getSelectedTaskDetails,
  deleteTask,
})(ColumnTaskItem);
