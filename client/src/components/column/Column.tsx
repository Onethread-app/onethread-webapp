import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

import CreateTaskButton from 'components/task/CreateTaskButton';

import { IColumn } from 'stores/board/Reducer';
import TasksContainer from 'components/task/TasksContainer';

const ColumnContainer = styled.div`
  padding: 1rem 0.5rem;
  max-width: 300px;
  min-width: 235px;
  box-shadow: ${(props) =>
    `rgb(0 0 0 / 20%) 0px 4px 6px 0px, ${
      props.isDragging ? '#3484F0' : 'rgba(0, 0, 0, 0.1)'
    }  0px 2px 4px 0px, ${
      props.isDragging ? '#3484F0' : 'rgba(255, 255, 255, 0.05)'
    } 0px 0px 0px 1px inset`};
  gap: 0.75rem;
  border-radius: 5px;
  transition: height 0.5s ease-in;
`;

const ColumnHeader = styled.h3`
  font-size: 18px;
  line-height: 30px;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding: 0 0.5rem;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
  color: #323030;
`;

interface IColumnProps {
  index: number;
  column: IColumn;
}

const Column = (props: IColumnProps) => {
  return (
    <Draggable draggableId={props.column._id} index={props.index}>
      {(provided, snapshot) => (
        <div
          className="flex flex-column"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <ColumnContainer
            className={`flex flex-column justify-center mb3`}
            isDragging={snapshot.isDragging}
          >
            <ColumnHeader {...provided.dragHandleProps}>
              {props.column.name}{' '}
              <span>{`(${props.column.tasks?.length})`}</span>
            </ColumnHeader>
            <TasksContainer column={props.column} />
          </ColumnContainer>
          {props.column.name.toLowerCase() !== 'done' &&
            props.column.name.toLowerCase().split(' ').join('-') !==
              'in-progress' && (
              <CreateTaskButton columnId={props.column._id} />
            )}
        </div>
      )}
    </Draggable>
  );
};

export default Column;
