import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';

import ColumnTaskItem from 'components/task/ColumnTaskItem';

import useWindowSize from 'helpers/hooks/useWindowSize';

import { IColumn } from 'stores/board/Reducer';

const TasksContainerDiv = styled.div`
  gap: 0.75rem;
  display: flex;
  max-height: ${(props) =>
    props.windowSize.height < 1080 ? '360px' : '560px'};
  padding: 0.5rem 0.35rem;
  min-height: ${(props) =>
    props.windowSize.height < 1080 ? '360px' : '560px'};

  &::-webkit-scrollbar {
    display: none;
  }

  ::-webkit-scrollbar-track {
    border: none;
  }

  &::-webkit-scrollbar-thumb {
    background: #dbdbdb;
    border: none;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  }

  &:hover {
    &::-webkit-scrollbar {
      display: block;
      background-color: transparent;
    }
  }
`;

interface ITasksContainer {
  column: IColumn;
}

const TasksContainer = (props: ITasksContainer) => {
  const windowSize = useWindowSize();
  return (
    <Droppable droppableId={props.column._id} type="task">
      {(provided, snapshot) => {
        const allowedProps = { ref: provided.innerRef };
        return (
          <TasksContainerDiv
            className={`flex flex-column h-100 overflow-x-hidden overflow-y-auto`}
            windowSize={windowSize}
            {...provided.droppableProps}
            {...allowedProps}
          >
            {props.column.tasks?.map((task, index) => (
              <ColumnTaskItem
                task={task}
                index={index}
                key={task._id}
              />
            ))}
          </TasksContainerDiv>
        );
      }}
    </Droppable>
  );
};

export default TasksContainer;
