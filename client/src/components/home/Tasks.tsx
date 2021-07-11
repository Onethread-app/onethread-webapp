import React, { useState, useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';

// import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';

import TaskItem from './TaskItem';

import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
import { sortTasks } from 'helpers/utils';

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
  const [filterOption, setFilterOption] = useState(1);
  const [tasks, setTasks] = useState<any>([]);
  const [tasksToShow, setTasksToShow] = useState<any>([]);
  const [todaysTasks, setTodaysTasks] = useState<any>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const getTasks = async () => {
      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        const response = await tigrowApi.get(
          `accounts/task-list?date=${new Date()}`,
          headers,
        );
        setTodaysTasks(response.data.todaysTasks);
        setUpcomingTasks(response.data.upcomingTasks);
        setLoading(false);
      }
    };
    getTasks();
  }, []);

  useEffect(() => {
    if (loading === false) {
      if (selectedTab === 1 && filterOption === 1) {
        setTasks(sortTasks(todaysTasks.assignToUser));
      }
      if (selectedTab === 1 && filterOption === 2) {
        setTasks(sortTasks(todaysTasks.assignByUser));
      }
      if (selectedTab === 2 && filterOption === 1) {
        setTasks(sortTasks(upcomingTasks.assignToUser));
      }
      if (selectedTab === 2 && filterOption === 2) {
        setTasks(sortTasks(upcomingTasks.assignByUser));
      }
    }
  }, [
    todaysTasks,
    upcomingTasks,
    filterOption,
    selectedTab,
    loading,
  ]);

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
    <div className="tasks">
      <div className="tasks-filter flex items-center justify-between">
        <div className="flex flex-column">
          <div className="flex items-center">
            <div
              className="flex items-center"
              onClick={() => {
                setSelectedTab(1);
                setFilterOption(1);
              }}
            >
              <h5 className={`${selectedTab === 1 ? 'active' : ''}`}>
                Today
              </h5>
              <span
                style={{
                  color: selectedTab === 1 ? '#000' : '#a4a4a4',
                  margin: '0 .25rem',
                }}
              >
                ({todaysTasks.totalTasks})
              </span>
            </div>
            <span className="divider">|</span>
            <div
              className="flex items-center"
              onClick={() => {
                setSelectedTab(2);
                setFilterOption(1);
              }}
            >
              <h5 className={`${selectedTab === 2 ? 'active' : ''}`}>
                Upcoming
              </h5>
              <span
                style={{
                  color: selectedTab === 2 ? '#000' : '#a4a4a4',
                  margin: '0 .25rem',
                }}
              >
                ({upcomingTasks.totalTasks})
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <p
              className={`${filterOption === 1 ? 'active' : ''}`}
              onClick={() => setFilterOption(1)}
            >
              Assigned to me{' '}
              {selectedTab === 1
                ? todaysTasks.assignToUser &&
                  todaysTasks.assignToUser.length > 0 &&
                  '*'
                : upcomingTasks.assignToUser &&
                  upcomingTasks.assignToUser.length > 0 &&
                  '*'}
            </p>
            <span className="divider-small">|</span>
            <p
              className={`${filterOption === 2 ? 'active' : ''}`}
              onClick={() => setFilterOption(2)}
            >
              Assigned by me{' '}
              {selectedTab === 1
                ? todaysTasks.assignByUser &&
                  todaysTasks.assignByUser.length > 0 &&
                  '*'
                : upcomingTasks.assignByUser &&
                  upcomingTasks.assignByUser.length > 0 &&
                  '*'}
            </p>
          </div>
        </div>
        {/* <div>
          <AddIcon className="pointer" />
        </div> */}
      </div>
      <div className="tasks-list w-100">
        <div className="header flex w-100">
          <div className={'w-10'}>No.</div>
          <div className="w-60">Task Name</div>
          <div className={`${isMobileOnly ? 'dn' : 'w-15 tc'}`}>
            Deadline
          </div>
          <div className={`${isMobileOnly ? 'w-30' : 'w-15'} tc`}>
            Status
          </div>
        </div>
        <div style={{ height: '265px' }}>
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
                    key={index}
                  />
                ),
            )
          ) : (
            <div className="w-100 tc gray mt2">
              Create some task in board!
            </div>
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

export default Tasks;
