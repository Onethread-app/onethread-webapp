import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import TablePagination from '@material-ui/core/TablePagination';

import { ITask, TaskBoard } from 'stores/task/Reducer';

import {
  sortTasksByDueDate,
  sortTasksByPriority,
  sortTasksByStatus,
} from 'helpers/utils';
import useElementSize from 'helpers/hooks/useElementSize';
import ListTaskItem from './ListTaskItem';

const TasksContainerDiv = styled.div`
  flex-grow: 1;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  position: relative;
  min-width: 680px;
`;

interface ITasksContainerInternalProps {
  currentBoard: TaskBoard;
}

const TasksContainer = (props: ITasksContainerInternalProps) => {
  const [itemHeight] = useState(56);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [tasks, setTasks] = useState<any>([]);
  const [tasksToShow, setTasksToShow] = useState<any>([]);
  const containerRef = useRef(null);
  const containerSize = useElementSize(containerRef);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangeRowsPerPage = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  useEffect(() => {
    if (containerSize.height > 0) {
      setItemsPerPage(
        Math.floor((containerSize.height - 50) / itemHeight),
      );
    }
  }, [containerSize, itemHeight]);

  useEffect(() => {
    if (props.currentBoard.sortBy === 'dueDate') {
      setTasks(
        sortTasksByDueDate([...tasks], props.currentBoard.orderBy),
      );
    } else if (props.currentBoard.sortBy === 'priority') {
      setTasks(
        sortTasksByPriority([...tasks], props.currentBoard.orderBy),
      );
    } else {
      const colTasks = props.currentBoard.columns
        .map((col) => col.tasks)
        .flat();
      const sortedTasks = sortTasksByStatus(colTasks);
      setTasks(sortedTasks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.currentBoard.sortBy,
    props.currentBoard.orderBy,
    props.currentBoard,
  ]);

  useEffect(() => {
    if (
      props.currentBoard.filteredUsers &&
      props.currentBoard.filteredUsers.length > 0
    ) {
      const filteredTasks: ITask[] = [];
      for (const task of props.currentBoard.columns
        .map((col) => col.tasks)
        .flat()) {
        let found = false;
        if (task?.assignedMembers) {
          for (const member of task.assignedMembers) {
            const res = props.currentBoard.filteredUsers.find(
              (fUser) => fUser.id === member._id,
            );
            if (res) {
              found = true;
              break;
            }
          }
          if (found) {
            filteredTasks.push(task);
          }
        }
      }
      setTasks(filteredTasks);
    } else {
      const colTasks = props.currentBoard.columns
        .map((col) => col.tasks)
        .flat();
      const sortedTasks = sortTasksByStatus(colTasks);
      setTasks(sortedTasks);
    }
  }, [props.currentBoard.columns, props.currentBoard.filteredUsers]);

  useEffect(() => {
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setTasksToShow(tasks.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, itemsPerPage, tasks]);

  return (
    <TasksContainerDiv ref={containerRef}>
      {tasksToShow.map((task: ITask) => (
        <ListTaskItem key={task._id} task={task} />
      ))}
      <TablePagination
        component="div"
        count={tasks.length}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={
          itemsPerPage > 10
            ? [5, 10, itemsPerPage, 25, 50, 100]
            : [5, itemsPerPage, 10, 25, 50, 100]
        }
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TasksContainerDiv>
  );
};

const mapStateToProps = (state: any) => ({
  currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
});

export default connect(mapStateToProps)(TasksContainer);
