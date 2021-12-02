import { useState, useEffect, useMemo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ITaskStatus, ITask } from 'stores/task/Reducer';
import { useTasksTableContext } from './TasksTableContext';

import {
  // filterTasksByProject,
  // filterTasksByStatus,
  // globalFilterFn,
  tasksFilterFn,
} from 'helpers/utils';
import useWindowSize from 'helpers/hooks/useWindowSize';
import ColumnTaskItem from 'components/task/ColumnTaskItem';
import { isEmpty, isNil } from 'lodash';

const TasksContainerDiv = styled.div`
  gap: 0.75rem;
  display: flex;
  padding: 0.5rem 0.35rem;
  border: ${(props) =>
    props.isDraggingOver
      ? '1px solid #34B3E9'
      : '1px solid rgba(0,0,0,0)'};
  border-radius: 4px;
`;

interface ITasksContainerProps {
  status: ITaskStatus;
}

interface ITasksContainerInternalProps extends ITasksContainerProps {
  // currentBoard: TaskBoard;
}

const TasksContainer = (props: ITasksContainerInternalProps) => {
  const {
    tasks,
    globalFilter,
    selectedProjectList,
    selectedStatusList,
    selectedLabelList,
    selectedDueDateOption,
    selectedDueDateRange,
  } = useTasksTableContext();
  const { status } = props;
  const memoizedTasks = useMemo(
    () => tasks.filter((task) => task.status?._id === status?._id),
    [status?._id, tasks],
  );
  const [columnTasks, setColumnTasks] =
    useState<ITask[]>(memoizedTasks);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (
      (!isNil(globalFilter) && !isEmpty(globalFilter)) ||
      (!isNil(selectedDueDateOption) &&
        !isEmpty(selectedDueDateOption)) ||
      (!isNil(selectedProjectList) &&
        !isEmpty(selectedProjectList)) ||
      (!isNil(selectedStatusList) && !isEmpty(selectedStatusList))
    ) {
      setColumnTasks(
        tasksFilterFn(
          memoizedTasks,
          globalFilter,
          selectedDueDateOption,
          selectedDueDateRange,
          selectedStatusList,
          selectedLabelList,
          selectedProjectList,
        ),
      );
    } else {
      setColumnTasks(memoizedTasks);
    }
  }, [
    globalFilter,
    memoizedTasks,
    selectedDueDateOption,
    selectedDueDateRange,
    selectedProjectList,
    selectedStatusList,
    selectedLabelList,
  ]);

  return (
    <Droppable droppableId={props.status._id} type="task">
      {(provided, snapshot) => {
        const allowedProps = { ref: provided.innerRef };
        return (
          <TasksContainerDiv
            className={`flex flex-column h-100`}
            windowSize={windowSize}
            isDraggingOver={snapshot.isDraggingOver}
            {...provided.droppableProps}
            {...allowedProps}
          >
            {columnTasks.map((task, index) => (
              <ColumnTaskItem
                task={task}
                index={index}
                key={String(task._id)}
              />
            ))}
          </TasksContainerDiv>
        );
      }}
    </Droppable>
  );
};

const mapStateToProps = (state: any) => ({
  // currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
});

export default connect(mapStateToProps)(TasksContainer);
