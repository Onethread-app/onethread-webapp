import React, { useState, useEffect } from 'react';

import TaskItem from './TaskItem';

import CircularProgress from '@material-ui/core/CircularProgress';

import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
import { sortTasks } from 'helpers/utils';
import Pagination from '@material-ui/lab/Pagination';
import { isMobileOnly } from 'react-device-detect';

const DueTasks = () => {
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState(1);
  const [tasks, setTasks] = useState<any>([]);
  const [tasksToShow, setTasksToShow] = useState<any>([]);
  const [assignedToMe, setAssignedToMe] = useState<any>([]);
  const [assignedByMe, setAssignedByMe] = useState<any>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  useEffect(() => {
    const getTasks = async () => {
      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        const response = await tigrowApi.get(
          `accounts/due-task`,
          headers,
        );
        setAssignedToMe(sortTasks(response.data.assignToUserDue));
        setAssignedByMe(sortTasks(response.data.assignByUserDue));
        setLoading(false);
      }
    };
    getTasks();
  }, []);

  useEffect(() => {
    if (filterOption === 1) {
      setTasks(assignedToMe);
    }
    if (filterOption === 2) {
      setTasks(assignedByMe);
    }
  }, [assignedByMe, assignedToMe, filterOption]);

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

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="due-tasks">
      <div className="flex flex-column w-100">
        <div className="flex items-center">
          <h3>Due Tasks</h3>
          <span className="ml1">
            ({assignedToMe.length + assignedByMe.length})
          </span>
        </div>
        <div className="due-tasks-filter flex items-center">
          <p
            className={`${filterOption === 1 ? 'active' : ''}`}
            onClick={() => setFilterOption(1)}
          >
            Assigned to me {assignedToMe.length > 0}
          </p>
          <span className="divider-small">|</span>
          <p
            className={`${filterOption === 2 ? 'active' : ''}`}
            onClick={() => setFilterOption(2)}
          >
            Assigned by me {assignedByMe.length > 0}
          </p>
        </div>
      </div>
      <div className="tasks-list w-100">
        <div className="header flex w-100">
          <div className="w-20">No.</div>
          <div className="w-80">Task Name</div>
        </div>
        <div style={{ height: '159px' }}>
          {loading ? (
            <div className="flex justify-center mt2 w-100">
              <CircularProgress
                style={{ color: 'rgba(0, 0, 0, 0.1)' }}
                size={26}
              />
            </div>
          ) : tasksToShow.length > 0 ? (
            tasksToShow.map(
              (task, index) =>
                task && (
                  <TaskItem
                    task={task}
                    index={tasks.indexOf(task)}
                    mini
                    key={index}
                  />
                ),
            )
          ) : (
            <div className="w-100 tc gray mt2">No Due Task</div>
          )}
        </div>
        {tasks.length > itemsPerPage && (
          <div className="flex justify-center mt2 w-100">
            <Pagination
              count={totalPage}
              onChange={handleChange}
              siblingCount={1}
              size={isMobileOnly ? 'small' : 'medium'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DueTasks;
