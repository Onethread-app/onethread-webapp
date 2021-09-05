import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isMobileOnly } from 'react-device-detect';
import Pagination from '@material-ui/lab/Pagination';
import { ITask } from 'stores/board/Reducer';
import TaskLitsItem from './TaskLitsItem';

export const TasksContainerDiv = styled.div`
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
  bottom: 0;
  margin-bottom: 1rem;
`;

const TaskTableContainer = (props: any) => {
  const [itemsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState<any>([]);
  const [tasksToShow, setTasksToShow] = useState<any>([]);

  useEffect(() => {
    setTasks(props.tasks);
  }, [props.tasks]);

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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <TasksContainerDiv>
        {tasksToShow.map((task: ITask) => (
          <TaskLitsItem key={task._id} task={task} />
        ))}
      </TasksContainerDiv>
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
    </>
  );
};

export default TaskTableContainer;
