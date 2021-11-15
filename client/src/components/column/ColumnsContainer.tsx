import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isEqual, orderBy } from 'lodash';
import styled from 'styled-components';
import {
  DragDropContext,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import {
  IColumn,
  ITask,
  ITaskStatus,
  TaskBoard,
} from 'stores/task/Reducer';
import { dragAndDropTask, updateColumn } from 'stores/task/Actions';

import Column from 'components/column/Column';
import { RightSidebar } from 'components/RightSidebar';
import { ColumnForm } from 'components/column/ColumnForm';

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
  columns: IColumn[];
  currentBoard: TaskBoard;
  dragAndDropTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    taskIndexOfDestinationColumn: number,
  ) => void;
  updateColumn: (columnInfo: any) => void;
  taskList: ITask[];
}

const ColumnsContainer = (props: IColumnsContainerInternalProps) => {
  const { taskList } = props;
  const [statuses, setStatues] = useState<ITaskStatus[]>([]);
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [showColumnFormDialog, setShowColumnFormDialog] =
    useState(false);

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
      console.log(result);
      // props.dragAndDropTask(
      //   result.draggableId,
      //   result.source.droppableId,
      //   result.destination.droppableId,
      //   result.destination.index,
      // );
    }

    if (result.type === 'column') {
      console.log(result);
      const newCols = Array.from(columns);
      const val = columns[result.source.index];
      newCols.splice(result.source.index, 1);
      newCols.splice(result.destination.index, 0, val);
      newCols.map(async (col, index) => {
        col.positionInBoard = index + 1;
        if (isEqual(columns[index], col) === false) {
          const columnInfo = {
            _id: col._id,
            name: col.name,
            positionInBoard: col.positionInBoard,
            boardId: props.currentBoard._id,
          };
          props.updateColumn(columnInfo);
        }
      });
      setColumns(newCols);
    }
  };

  useEffect(() => {
    const cols = orderBy(props.columns, ['positionInBoard']);
    setColumns(cols);
  }, [props.columns]);

  useEffect(() => {
    const tempStatuses = taskList.map((task) => task.status);
    const uniqueStatuses: ITaskStatus[] = [];
    tempStatuses.forEach((status) => {
      if (uniqueStatuses.length === 0) {
        uniqueStatuses.push(status);
      } else {
        const isExist = uniqueStatuses.some((item) => {
          return item._id === status._id;
        });
        if (!isExist) {
          uniqueStatuses.push(status);
        }
      }
    });
    setStatues(uniqueStatuses);
  }, [taskList]);

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
                <RightSidebar
                  onClose={() => setShowColumnFormDialog(false)}
                >
                  <ColumnForm
                    setShowColumnFormDialog={setShowColumnFormDialog}
                  />
                </RightSidebar>
              )}
            </ColumnsContainerDiv>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

const mapStateToProps = (state: any) => ({
  columns: state.taskIndexReducer.taskReducer.currentBoard.columns,
  currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
});

export default connect(mapStateToProps, {
  dragAndDropTask,
  updateColumn,
})(ColumnsContainer);
