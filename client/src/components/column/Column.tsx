import { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

import { IColumn } from 'stores/task/Reducer';
import TasksContainer from 'components/task/TasksContainer';

const ColumnContainer = styled.div`
  padding: 1rem 0.5rem;
  max-width: 300px;
  min-width: 235px;
  box-shadow: ${(props) => `rgb(0 0 0 / 20%) 0px 4px 6px 0px, ${
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
  display: flex;
  align-items: center;
`;

const HeaderIcon = styled.span`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: ${(props) => (props.columnName === 'done'
    ? '#62C89D'
    : props.columnName === 'in-progress'
      ? '#08A0F7'
      : '#FFA800')};
  margin-right: 0.5rem;
`;

interface IColumnProps {
  index: number;
  column: IColumn;
}

const Column = (props: IColumnProps) => {
  const [columnName] = useState(
    props.column.name.toLowerCase().split(' ').join('-'),
  );

  return (
    <Draggable draggableId={props.column._id} index={props.index}>
      {(provided, snapshot) => (
        <div
          className='flex flex-column'
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <ColumnContainer
            className='flex flex-column justify-center mb3'
            isDragging={snapshot.isDragging}
            columnName={columnName}
          >
            <ColumnHeader {...provided.dragHandleProps}>
              <HeaderIcon columnName={columnName} />
              {props.column.name}
              {' '}
              <span className='ml2'>{`(${props.column.tasks?.length})`}</span>
            </ColumnHeader>
            <TasksContainer column={props.column} />
          </ColumnContainer>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
