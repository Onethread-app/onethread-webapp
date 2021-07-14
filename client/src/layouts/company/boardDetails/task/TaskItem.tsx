import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { TaskBoard, ITask } from 'stores/board/Reducer';
import { ICompany } from 'stores/company/Reducer';
import {
  getSelectedTaskDetails,
  ITaskDelete,
} from 'stores/board/Actions';
import { deleteTask } from 'stores/board/Actions';
import moment from 'moment';
import { projectPermit } from 'stores/UtilsActions';
import {
  Button,
  ButtonGroup,
  Dialog,
  Icon,
  Menu,
  MenuItem,
  Popover,
} from '@blueprintjs/core';

interface TaskItemProps {
  key: string;
  task: ITask;
  index: number;
  columnId: string;
}

interface TaskItemInternalProps extends TaskItemProps {
  currentBoard?: TaskBoard;
  company?: ICompany;
  getSelectedTaskDetails: (task: string) => void;
  projectRole: string;
  optionalRole?: Array<string>;
  deleteTask: ({ taskId, columnId }: ITaskDelete) => void;
  deletingTask: boolean;
  errorOnTaskDelete: string;
  projectId: string;
  fetchingTask: boolean;
  taskError: string;
}

const TaskItemComponent = (props: TaskItemInternalProps) => {
  const [loadingSingleTask, setLoadingSingleTask] = React.useState(
    false,
  );
  const [showTaskEditDialog, setShowTaskEditDialog] = React.useState(
    false,
  );
  const history = useHistory();

  React.useEffect(() => {
    if (
      loadingSingleTask === true &&
      props.fetchingTask === false &&
      props.taskError === ''
    ) {
      setLoadingSingleTask(false);
      history.push(
        `/company/${props.company!.uniqueName}/project/${
          props.projectId
        }/board/${props.currentBoard!._id}/task/${props.task._id}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingSingleTask, props.fetchingTask, props.taskError]);

  const handleClick = () => {
    if (props.task._id) {
      props.getSelectedTaskDetails(props.task._id);
      setLoadingSingleTask(true);
    }
  };

  const handleDelete = async () => {
    const payload = {
      taskId: props.task._id,
      columnId: props.columnId,
    };

    await props.deleteTask(payload);

    if (
      props.deletingTask === false &&
      props.errorOnTaskDelete === ''
    ) {
      setShowTaskEditDialog(false);
    }
  };

  return (
    <>
      <Draggable draggableId={props.task._id!} index={props.index}>
        {(provided, snapshot) => {
          const allowedProps = { ref: provided.innerRef };
          return (
            <div
              className={`ba b--black-20 br2 mb2
              ${snapshot.isDragging ? 'bg-light-green' : 'bg-white'}`}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              {...allowedProps}
            >
              <div
                className="br3 flex justify-between items-center mt2"
                style={{
                  borderLeft: '4px solid rgb(97, 163, 250)',
                  borderRadius: '3px',
                  height: '40px',
                  marginLeft: '-2px',
                }}
              >
                <h1
                  className="f6 ws-break ph2 overflow-hidden pointer"
                  style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    width: '440px',
                  }}
                  onClick={handleClick}
                >
                  {props.task.name}
                </h1>
                {props.company &&
                  (projectPermit(props.company.role) ||
                    (props.projectRole === 'projectModerator' &&
                      props.optionalRole!.includes(
                        'createUpdateBoard',
                      ))) && (
                    <Popover
                      className="w-10"
                      content={
                        <Menu>
                          <MenuItem
                            text="Delete"
                            onClick={(e: any) =>
                              setShowTaskEditDialog(true)
                            }
                          />
                        </Menu>
                      }
                      target={
                        <Button
                          style={{
                            transform: 'rotate(90deg)',
                            OTransform: 'rotate(90deg)',
                            msTransform: 'rotate(90deg)',
                            WebkitTransform: 'rotate(90deg)',
                          }}
                          icon="more"
                          minimal={true}
                        />
                      }
                    />
                  )}
              </div>
              {/* {isEmpty(props.task.description) === false ?
                <div>
                  <p
                    className="ph2 pt2 ws-break"
                  >
                    {props.task.description}
                  </p>
                </div>
                : undefined} */}
              <div className="flex-ns justify-between pa2">
                {/* <div className="flex pt1">
                  <div className="cf flex" style={{ height: '30px', width: '50px' }}>
                    <img
                      style={{ height: '25px', width: '25px' }}
                      src={attach}
                    />
                    <div className="pt1">
                      <p className="f7 dib">3</p>
                    </div>
                  </div>
                  <div className="cf flex" style={{ height: '30px', width: '50px' }}>
                    <img
                      style={{ height: '25px', width: '25px' }}
                      src={complete}
                    />
                    <div className="pt1">
                      <p className="f7 dib">3</p>
                    </div>
                  </div>
                </div> */}
                {props.task.dueDate && (
                  <div className="mr0 pt1">
                    {Math.ceil(
                      moment(props.task.dueDate).diff(
                        moment(),
                        'days',
                        true,
                      ),
                    ) === 0 ? (
                      <p
                        className="bg-washed-red ph2 pv1 red br2 mv1"
                        style={{
                          fontSize: '12px',
                        }}
                      >
                        Deadline ends today
                      </p>
                    ) : Math.ceil(
                        moment(props.task.dueDate).diff(
                          moment(),
                          'days',
                          true,
                        ),
                      ) < 0 ? (
                      <p
                        className="ph2 pv1 br2 mv1"
                        style={{
                          color: '#3a844a',
                          background: '#c2eacb',
                          fontSize: '12px',
                        }}
                      >
                        Expired
                      </p>
                    ) : Math.ceil(
                        moment(props.task.dueDate).diff(
                          moment(),
                          'days',
                          true,
                        ),
                      ) === 1 ? (
                      <p
                        className="ph2 pv1 br2 mv1"
                        style={{
                          color: '#3a844a',
                          background: '#c2eacb',
                          fontSize: '12px',
                        }}
                      >
                        {Math.ceil(
                          moment(props.task.dueDate).diff(
                            moment(),
                            'days',
                            true,
                          ),
                        )}{' '}
                        day remaining
                      </p>
                    ) : (
                      <p
                        className="ph2 pv1 br2 mv1"
                        style={{
                          color: '#3a844a',
                          background: '#c2eacb',
                          fontSize: '12px',
                        }}
                      >
                        {Math.ceil(
                          moment(props.task.dueDate).diff(
                            moment(),
                            'days',
                            true,
                          ),
                        )}{' '}
                        days remaining
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Draggable>

      <Dialog
        isOpen={showTaskEditDialog}
        style={{ paddingBottom: '0' }}
        canOutsideClickClose={true}
      >
        <div
          className="flex justify-around items-center w-100 ba bw1 br2"
          style={{ borderColor: '#F55B7F' }}
        >
          <h4 className="fw5 f5 flex items-center">
            <Icon
              icon="info-sign"
              intent="primary"
              style={{ marginRight: '.5rem' }}
            />{' '}
            Are you sure?
          </h4>
          <ButtonGroup minimal={true}>
            <Button
              icon="undo"
              onClick={() => {
                setShowTaskEditDialog(false);
              }}
              intent="primary"
            >
              No, Keep it
            </Button>
            <Button
              icon="trash"
              intent="danger"
              onClick={handleDelete}
            >
              Yes, Delete
            </Button>
          </ButtonGroup>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentBoard: state.boardIndexReducer.boardReducer.currentBoard,
    fetchingTask: state.boardIndexReducer.boardReducer.fetchingTask,
    taskError: state.boardIndexReducer.boardReducer.taskError,
    deletingTask: state.boardIndexReducer.boardReducer.deletingTask,
    errorOnTaskDelete:
      state.boardIndexReducer.boardReducer.errorOnTaskDelete,
    company: state.companyReducer.currentCompany,
    projectRole: state.projectReducer.projectRole.projects.role,
    projectId: state.projectReducer.projectDetails._id,
    optionalRole:
      state.projectReducer.projectRole.projects.project.optionalRole,
  };
};

export const TaskItem = connect(mapStateToProps, {
  getSelectedTaskDetails,
  deleteTask,
})(TaskItemComponent);
