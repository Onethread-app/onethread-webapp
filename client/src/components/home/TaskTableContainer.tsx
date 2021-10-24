import { useEffect, useState } from 'react';
import styled from 'styled-components';

import TablePagination from '@material-ui/core/TablePagination';

import { ITask } from 'stores/task/Reducer';

import TaskLitsItem from './TaskLitsItem';

export const TasksContainerDiv = styled.div`
  flex-grow: 1;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  position: relative;
  min-width: 680px;
`;

const TaskTableContainer = (props: any) => {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [tasks, setTasks] = useState<any>([]);
  const [tasksToShow, setTasksToShow] = useState<any>([]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangeRowsPerPage = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  useEffect(() => {
    setTasks(props.tasks);
  }, [props.tasks]);

  useEffect(() => {
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setTasksToShow(tasks.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, itemsPerPage, tasks]);

  return (
    <>
      <TasksContainerDiv>
        {tasksToShow.map((task: ITask, i) => (
          <TaskLitsItem key={i} task={task} />
        ))}
      </TasksContainerDiv>
      <TablePagination
        component="div"
        count={tasks.length}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TaskTableContainer;
