import React, { useEffect, useState, useRef } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Pagination from '@material-ui/lab/Pagination/Pagination';

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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-height: 50px;
  position: absolute;
  bottom: 0;
  margin-bottom: 1rem;
`;

interface ITasksContainerInternalProps {
  currentBoard: TaskBoard;
}

const TasksContainer = (props: ITasksContainerInternalProps) => {
  const [itemHeight] = useState(56);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState<any>([]);
  const [tasksToShow, setTasksToShow] = useState<any>([]);
  const containerRef = useRef(null);
  const containerSize = useElementSize(containerRef);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
    if (tasks.length > 0) {
      setTotalPage(Math.ceil(tasks.length / itemsPerPage));
    }
  }, [itemsPerPage, tasks]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setTasksToShow(tasks.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, itemsPerPage, tasks]);

  return (
    <TasksContainerDiv ref={containerRef}>
      {tasksToShow.map((task: ITask) => (
        <ListTaskItem key={task._id} task={task} />
      ))}
      {tasks.length > itemsPerPage && (
        <PaginationContainer>
          <Pagination
            count={totalPage}
            onChange={handlePageChange}
            siblingCount={1}
            size={isMobileOnly ? 'small' : 'medium'}
          />
        </PaginationContainer>
      )}
    </TasksContainerDiv>
  );
};

const mapStateToProps = (state: any) => ({
  currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
});

export default connect(mapStateToProps)(TasksContainer);
