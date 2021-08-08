import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { isEqual, orderBy } from 'lodash';
import {
  DragDropContext,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { Icon } from '@blueprintjs/core';

import Column from 'components/column/Column';

import { dragAndDropTask, updateColumn } from 'stores/board/Actions';
import { IColumn, TaskBoard } from 'stores/board/Reducer';
import { ColumnForm } from 'layouts/company/boardDetails/column/ColumnForm';
import { RightSidebar } from 'components/RightSidebar';

const ColumnsContainerDiv = styled.div`
  gap: 1.25rem;
  flex-grow: 1;
  padding: 1rem;
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
}

const ColumnsContainer = (props: IColumnsContainerInternalProps) => {
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [
    showColumnFormDialog,
    setShowColumnFormDialog,
  ] = React.useState(false);

  React.useEffect(() => {
    const cols = orderBy(props.columns, ['positionInBoard']);
    setColumns(cols);
  }, [props.columns]);

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
      props.dragAndDropTask(
        result.draggableId,
        result.source.droppableId,
        result.destination.droppableId,
        result.destination.index,
      );
    }

    if (result.type === 'column') {
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
              className={`flex flex-row overflow-x-auto items-start mw-100`}
              {...provided.droppableProps}
              {...allowedProps}
            >
              {columns.map((col: IColumn, index) => (
                <Column column={col} index={index} key={col._id} />
              ))}
              <AddColumnButton
                onClick={() => setShowColumnFormDialog(true)}
              >
                <Icon icon="plus" color="#34B3E9" />
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
  columns: state.boardIndexReducer.boardReducer.currentBoard.columns,
  currentBoard: state.boardIndexReducer.boardReducer.currentBoard,
});

export default connect(mapStateToProps, {
  dragAndDropTask,
  updateColumn,
})(ColumnsContainer);
