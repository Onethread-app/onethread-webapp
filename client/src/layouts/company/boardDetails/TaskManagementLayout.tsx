import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { Column } from './column/Column';
import { IColumn } from 'stores/board/Reducer';
import { connect } from 'react-redux';
import { dragAndDropTask } from 'stores/board/Actions';
import { Button } from '@blueprintjs/core';
import { RightSidebar } from 'components/RightSidebar';
import { ColumnForm } from './column/ColumnForm';
import { projectRules } from '../project/settings/projectrules';

interface TaskManagementLayoutProps {
  columns: IColumn[];
}

interface TaskManagementLayoutInternalProps
  extends TaskManagementLayoutProps {
  dragAndDropTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    taskIndexOfDestinationColumn: number,
  ) => void;
  role: string;
  optionalRole: any;
}

const TaskManagementLayoutComponent = (
  props: TaskManagementLayoutInternalProps,
) => {
  const [showColumnFormDialog, setShowColumnFormDialog] = useState(
    false,
  );
  const permissions = projectRules(props.role, props.optionalRole);

  const dragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return;
    }
    await props.dragAndDropTask(
      result.draggableId,
      result.source.droppableId,
      result.destination.droppableId,
      result.destination.index,
    );

    // if (result.type === "column") {
    //   const newColumnOrder = Array.from(state.columnOrder);
    //   newColumnOrder.splice(result.source.index, 1);
    //   newColumnOrder.splice(result.destination.index, 0, result.draggableId);
    //   setState({
    //     ...state,
    //     columnOrder: newColumnOrder
    //   });
    //   return;
    // }

    // const sourceColumn = (state.columns as any)[result.source.droppableId];
    // const destinationColumn = (state.columns as any)[result.destination.droppableId];

    // if (sourceColumn === destinationColumn) {
    //   const newTaskIds = Array.from(sourceColumn.taskIds);
    //   newTaskIds.splice(result.source.index, 1);
    //   newTaskIds.splice(result.destination.index, 0, result.draggableId);

    // const newColumn = {
    //   ...sourceColumn,
    //   taskIds: newTaskIds
    // }
    // setState({
    //   ...state,
    //   columns: {
    //     ...state.columns,
    //     [newColumn.id]: newColumn
    //   }
    // });
    // } else {
    // const sourceColumnTaskIds = Array.from(sourceColumn.taskIds);
    // sourceColumnTaskIds.splice(result.source.index, 1);
    // const newSourceColumnTaskIds = {
    //   ...sourceColumn,
    //   taskIds: sourceColumnTaskIds
    // }
    // const destinationColumnTaskIds = Array.from(destinationColumn.taskIds);
    // destinationColumnTaskIds.splice(result.destination.index, 0, result.draggableId);
    // const newDestinationColumnTaskIds = {
    //   ...destinationColumn,
    //   taskIds: destinationColumnTaskIds
    // }
    // setState({
    //   ...state,
    //   columns: {
    //     ...state.columns,
    //     [newSourceColumnTaskIds.id]: newSourceColumnTaskIds,
    //     [newDestinationColumnTaskIds.id]: newDestinationColumnTaskIds
    //   }
    // })
    // }
  };

  return (
    <>
      <div className="h-100">
        <DragDropContext onDragEnd={(result) => dragEnd(result)}>
          <Droppable
            droppableId="all-columns"
            type="column"
            direction="horizontal"
          >
            {(provided) => {
              const allowedProps = { ref: provided.innerRef };
              return (
                <div
                  className="flex h-100"
                  {...provided.droppableProps}
                  {...allowedProps}
                >
                  <div className="fl nowrap w-100 overflow-y-hidden">
                    {props.columns && props.columns.length > 0 ? (
                      props.columns.map((colmun, index) => (
                        <Column
                          key={
                            colmun._id ? colmun._id : `col${index}`
                          }
                          column={colmun}
                          index={index}
                        />
                      ))
                    ) : (
                      <h5 className="tc fw5 f3">No Columns</h5>
                    )}
                    {provided.placeholder}
                    {permissions.grantAll || permissions.projectModerator.includes('assignDeleteMemberBoard') ? (
                      <div
                        className={`${
                          props.columns && props.columns.length > 0
                            ? 'dib'
                            : 'tc'
                        } pr2  w-23-l w-50-m w-50 br3`}
                        style={{ margin: '0 auto' }}
                      >
                        <Button
                          className="pointer bp3-minimal w-100 ba b--dashed"
                          style={{
                            outline: 'none',
                            color: 'black',
                            height: '80px',
                            fontWeight: 'bold',
                          }}
                          type="submit"
                          onClick={() =>
                            setShowColumnFormDialog(
                              !showColumnFormDialog,
                            )
                          }
                          icon="add"
                        >
                          Add Column
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </div>
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
    </>
  );
};
const mapStateToProps = (state: any) => ({
  role:
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.role,
  optionalRole:
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.project.optionalRole,
});

export const TaskManagementLayout = connect(mapStateToProps, {
  dragAndDropTask,
})(TaskManagementLayoutComponent);
