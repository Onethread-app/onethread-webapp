import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { isEqual, orderBy } from 'lodash';
import styled from 'styled-components';
import {
  DragDropContext,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import { ITaskStatus } from 'stores/task/Reducer';
import {
  dragAndDropTask,
  updateTaskStatus,
  updateTask,
} from 'stores/task/Actions';

import Column from 'components/column/Column';
import { ColumnForm } from 'components/column/ColumnForm';
import { errorToaster } from 'components/toast/Toaster';
import { useTasksTableContext } from 'components/task/TasksTableContext';
import { isEqual } from 'lodash';
import { Dialog } from '@blueprintjs/core';

const ColumnsContainerDiv = styled.div`
  gap: 1.25rem;
  flex-grow: 1;
  padding: 1rem;
  align-items: stretch;

  @media only screen and (max-width: 768px) {
    margin-bottom: 4rem;
  }
`;

const AddColumnButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.1rem;
  border: 1px dashed #cacaca;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  height: 48px;
  width: 48px;
`;

interface IColumnsContainerInternalProps {
  dragAndDropTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    taskIndexOfDestinationColumn: number,
  ) => void;
  companyId: string;
  projectId: string;
  taskStatusList: ITaskStatus[];
  updatingTask: boolean;
  errorOnUpdatingTask: string;
  updateTask: (taskInfo) => void;
  updateTaskStatus: (task) => void;
  updateTaskStatusForBoardLocally?: (task) => void;
}

const ColumnsContainer = (props: IColumnsContainerInternalProps) => {
  const { tasks } = useTasksTableContext();
  const [statuses, setStatuses] = useState<ITaskStatus[]>([]);
  // const [columns,setColumns] = useState<IColumn[]>([]);
  const [showColumnFormDialog, setShowColumnFormDialog] =
    useState(false);
  const [showEditStatus, setShowEditStatus] = useState(false);
  const [updatingTask, setUpdatingTask] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<ITaskStatus>(
    {} as ITaskStatus,
  );

  const dragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return;
    }
    if (result.type === 'task') {
      setUpdatingTask(true);
      props.updateTaskStatusForBoardLocally?.({
        _id: result.draggableId,
        status: result.destination.droppableId,
      });
      props.updateTask({
        taskId: result.draggableId,
        companyId: props.companyId,
        projectId: props.projectId,
        status: result.destination.droppableId,
      });
    }

    if (result.type === 'column') {
      const newCols = Array.from(statuses);
      const val = statuses[result.source.index];
      newCols.splice(result.source.index, 1);
      newCols.splice(result.destination.index, 0, val);
      newCols.map(async (col, index) => {
        col.positionInBoard = index + 1;
        if (isEqual(statuses[index], col) === false) {
          const statusInfo = {
            _id: col._id,
            name: col.name,
            positionInBoard: col.positionInBoard,
          };
          props.updateTaskStatus({
            ...statusInfo,
            projectId: props.projectId,
          });
        }
      });
      setStatuses(
        newCols.sort((a, b) => a.positionInBoard - b.positionInBoard),
      );
    }
  };

  useEffect(() => {
    tasks.length > 0 &&
      setStatuses(
        tasks[0].statusList.sort(
          (a, b) => a.positionInBoard - b.positionInBoard,
        ),
      );
  }, [tasks]);

  useEffect(() => {
    if (
      updatingTask &&
      props.updatingTask === false &&
      props.errorOnUpdatingTask !== ''
    ) {
      errorToaster('There was an error moving the task');
    }
  }, [props.updatingTask, props.errorOnUpdatingTask, updatingTask]);

  return (
    <DragDropContext
      onDragEnd={(result: DropResult) => dragEnd(result)}
    >
      <Droppable
        droppableId="all-columns"
        type="column"
        direction="horizontal"
      >
        {(provided) => {
          const allowedProps = { ref: provided.innerRef };
          return (
            <ColumnsContainerDiv
              className={`flex flex-row overflow-x-auto items-start mw-100 h-100`}
              {...provided.droppableProps}
              {...allowedProps}
            >
              {' '}
              {statuses.map((status, index) => (
                <Column
                  status={status}
                  index={index}
                  key={status._id}
                  setUpdateStatus={setUpdateStatus}
                  setShowEditStatus={setShowEditStatus}
                />
              ))}
              {/* {columns.map((col: IColumn, index) => (
                <Column column={col} index={index} key={col._id} />
              ))} */}
              <AddColumnButton
                onClick={() => setShowColumnFormDialog(true)}
              >
                <Icon icon="plus" color="#08A0F7" />
              </AddColumnButton>
              {showColumnFormDialog && (
                <Dialog
                  isOpen={showColumnFormDialog}
                  canOutsideClickClose={true}
                  canEscapeKeyClose={true}
                  onClose={() => setShowColumnFormDialog(false)}
                  className="h-auto w-auto pb0 bg-white"
                >
                  <ColumnForm
                    setShowColumnFormDialog={setShowColumnFormDialog}
                  />
                </Dialog>
              )}
              {showEditStatus ? (
                <Dialog
                  isOpen={showEditStatus}
                  canOutsideClickClose={true}
                  canEscapeKeyClose={true}
                  className="h-auto w-auto pb0 bg-white"
                  onClose={() => setShowEditStatus(false)}
                >
                  <ColumnForm
                    setShowColumnFormDialog={setShowEditStatus}
                    status={updateStatus}
                  />
                </Dialog>
              ) : null}
            </ColumnsContainerDiv>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

const mapStateToProps = (state: any) => ({
  companyId: state.companyReducer.currentCompany._id,
  projectId: state.projectReducer.projectDetails._id,
  taskStatusList: state.projectReducer.projectDetails.taskStatus,
  updatingTask: state.taskIndexReducer.taskReducer.updatingTask,
  errorOnUpdatingTask:
    state.taskIndexReducer.taskReducer.errorOnUpdatingTask,
});

export default connect(mapStateToProps, {
  dragAndDropTask,
  updateTaskStatus,
  updateTask,
})(ColumnsContainer);
