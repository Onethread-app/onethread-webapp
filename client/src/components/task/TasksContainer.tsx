import {
  useState,
  useEffect,
  // useMemo
} from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  // IColumn,
  ITaskStatus,
  ITask,
  // TaskBoard,
} from 'stores/task/Reducer';
import { useTasksTableContext } from './TasksTableContext';

import { globalFilterFn } from 'helpers/utils';
// import {
//   sortTasksByDueDate,
//   sortTasksByPriority,
// } from 'helpers/utils';
import useWindowSize from 'helpers/hooks/useWindowSize';
import ColumnTaskItem from 'components/task/ColumnTaskItem';
import { isNil } from 'lodash';

const TasksContainerDiv = styled.div`
  gap: 0.75rem;
  display: flex;
  padding: 0.5rem 0.35rem;
  border: ${(props) =>
    props.isDraggingOver
      ? '1px solid #34B3E9'
      : '1px solid rgba(0,0,0,0)'};
  border-radius: 4px;

  /* &::-webkit-scrollbar {
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
  } */
`;

interface ITasksContainerProps {
  status: ITaskStatus;
}

interface ITasksContainerInternalProps extends ITasksContainerProps {
  // currentBoard: TaskBoard;
}

const TasksContainer = (props: ITasksContainerInternalProps) => {
  const { tasks, globalFilter } = useTasksTableContext();
  const { status } = props;
  const [columnTasks, setColumnTasks] = useState<ITask[]>([]);
  const windowSize = useWindowSize();
  // const memoizedTasks = useMemo(() => columnTasks, [columnTasks]);

  useEffect(() => {
    const colTasks = tasks.filter(
      (task) => task.status._id === status._id,
    );
    setColumnTasks(colTasks);
  }, [tasks, status]);

  useEffect(() => {
    // setColumnTasks(globalFilterFn(columnTasks, globalFilter));
    if (!isNil(globalFilter))
      console.log(
        'globalFilter',
        globalFilter,
        globalFilterFn(columnTasks, globalFilter),
      );
  }, [columnTasks, globalFilter]);

  // useEffect(() => {
  //   if (props.currentBoard.sortBy === 'dueDate') {
  //     setTasks(
  //       sortTasksByDueDate([...tasks], props.currentBoard.orderBy),
  //     );
  //   } else if (props.currentBoard.sortBy === 'priority') {
  //     setTasks(
  //       sortTasksByPriority([...tasks], props.currentBoard.orderBy),
  //     );
  //   } else {
  //     if (props.column.tasks) setTasks(props.column.tasks);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   props.column,
  //   props.currentBoard.orderBy,
  //   props.currentBoard.sortBy,
  // ]);

  // useEffect(() => {
  //   if (props.currentBoard.filteredUsers!.length > 0) {
  //     const filteredTasks: ITask[] = [];
  //     for (const task of props.column.tasks!) {
  //       let found = false;
  //       if (task?.assignedMembers) {
  //         for (const member of task.assignedMembers) {
  //           const res = props.currentBoard.filteredUsers.find(
  //             (fUser) => fUser.id === member._id,
  //           );
  //           if (res) {
  //             found = true;
  //             break;
  //           }
  //         }
  //         if (found) {
  //           filteredTasks.push(task);
  //         }
  //       }
  //     }
  //     setTasks(filteredTasks);
  //   } else {
  //     if (props.column.tasks) setTasks(props.column.tasks);
  //   }
  // }, [props.currentBoard.filteredUsers]);

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
                key={task._id}
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
