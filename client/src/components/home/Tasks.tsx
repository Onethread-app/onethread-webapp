import React, { useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import Select from 'react-select';

import CircularProgress from '@material-ui/core/CircularProgress';

import { tigrowApi } from 'config';
import { sortTasks } from 'helpers/utils';
import { tokenConfig } from 'stores/UtilsActions';

// import Table from './TaskTable';
import Table from './TasksTable2';

type Order = 'asc' | 'desc';
interface Data {
  no: string;
  taskName: string;
  assignee: string;
  deadline: string;
  status: string;
}

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
  const [filterOption, setFilterOption] = useState(1);

  const [tasks, setTasks] = useState<any>([]);
  const [todaysTasks, setTodaysTasks] = useState<any>([]);
  const [tomorrowTasks, setTomorrowTasks] = useState<any>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any>([]);
  const [dueTasks, setDueTasks] = useState<any>([]);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>(
    'deadline',
  );
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedTabOptions, setSelectedTabOptions] = useState([
    { value: 1, label: 'Today' },
    { value: 2, label: 'Tomorrow' },
    { value: 3, label: 'Upcoming' },
    { value: 4, label: 'Due Tasks' },
  ]);
  const [selectedTabOnSelect, setSelectedTabOnSelect] = useState(
    selectedTabOptions[0],
  );

  useEffect(() => {
    const getTasks = async () => {
      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        const response = await tigrowApi.get(
          `accounts/task-list?date=${new Date()}`,
          headers,
        );
        setTodaysTasks(response.data.todaysTasks);
        setTomorrowTasks(response.data.tomorrowTasks);
        setUpcomingTasks(response.data.upcomingTasks);
        setDueTasks(response.data.dueTasks);
        setSelectedTabOptions((prevState) => {
          return prevState.map((option) => {
            if (option.value === 1) {
              return {
                value: option.value,
                label: `${option.label} (${response.data.todaysTasks.totalTasks})`,
              };
            } else if (option.value === 2) {
              return {
                value: option.value,
                label: `${option.label} (${response.data.tomorrowTasks.totalTasks})`,
              };
            } else if (option.value === 3) {
              return {
                value: option.value,
                label: `${option.label} (${response.data.upcomingTasks.totalTasks})`,
              };
            } else {
              return {
                value: option.value,
                label: `${option.label} (${response.data.dueTasks.totalTasks})`,
              };
            }
          });
        });
        setLoading(false);
      }
    };
    getTasks();
  }, []);

  useEffect(() => {
    setSelectedTabOnSelect(selectedTabOptions[0]);
  }, [selectedTabOptions]);

  const ISOformat = (time) => {
    if (!time) return null;
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const [day, month, year] = new Date(time)
      .toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .map((d) => parseInt(d));
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };

  const mdfy = (task) => {
    let taskList = task.map((t, i) => ({
      taskName: t.taskId.name,
      assignee:
        t.assignedPerson.firstName + ' ' + t.assignedPerson.lastName,
      deadline: ISOformat(t.taskId.dueDate),
      status: t.taskId.status,
      redirectTo: `/company/${t.taskId.project.company.uniqueName}/project/${t.taskId.project._id}/board/${t.taskId.boardId._id}/task/${t.taskId._id}`,
      subTasks: t.subTasks,
    }));
    taskList.sort((a, b) => {
      const aTime: any = new Date(a.deadline);
      const bTime: any = new Date(b.deadline);
      return aTime - bTime;
    });
    taskList = taskList.map((t, i) => ({ no: i + 1, ...t }));
    return taskList;
  };

  useEffect(() => {
    if (loading === false) {
      if (selectedTab === 1 && filterOption === 1) {
        setTasks(mdfy(sortTasks(todaysTasks.assignToUser)));
      }
      if (selectedTab === 1 && filterOption === 2) {
        setTasks(mdfy(sortTasks(todaysTasks.assignByUser)));
      }
      if (selectedTab === 2 && filterOption === 1) {
        setTasks(mdfy(sortTasks(tomorrowTasks.assignToUser)));
      }
      if (selectedTab === 2 && filterOption === 2) {
        setTasks(mdfy(sortTasks(tomorrowTasks.assignByUser)));
      }
      if (selectedTab === 3 && filterOption === 1) {
        setTasks(mdfy(sortTasks(upcomingTasks.assignToUser)));
      }
      if (selectedTab === 3 && filterOption === 2) {
        setTasks(mdfy(sortTasks(upcomingTasks.assignByUser)));
      }
      if (selectedTab === 4 && filterOption === 1) {
        setTasks(mdfy(sortTasks(dueTasks.assignToUser)));
      }
      if (selectedTab === 4 && filterOption === 2) {
        setTasks(mdfy(sortTasks(dueTasks.assignByUser)));
      }
    }
  }, [
    todaysTasks,
    tomorrowTasks,
    upcomingTasks,
    dueTasks,
    filterOption,
    selectedTab,
    loading,
  ]);

  useEffect(() => {
    setSelectedTab(selectedTabOnSelect.value);
  }, [selectedTabOnSelect]);

  const showStar = (assignTo) => {
    const select = assignTo ? 'assignToUser' : 'assignByUser';
    if (selectedTab === 1) {
      return (
        todaysTasks[select] && todaysTasks[select].length > 0 && '*'
      );
    } else if (selectedTab === 2) {
      return (
        tomorrowTasks[select] &&
        tomorrowTasks[select].length > 0 &&
        '*'
      );
    } else if (selectedTab === 3) {
      return (
        upcomingTasks[select] &&
        upcomingTasks[select].length > 0 &&
        '*'
      );
    } else {
      return dueTasks[select] && dueTasks[select].length > 0 && '*';
    }
  };

  const handleSelectChange = (selectedOptionOnSelect) => {
    setSelectedTabOnSelect(selectedOptionOnSelect);
  };

  return (
    <div className="tasks">
      <div
        className={`tasks-filter flex items-center  ${
          isMobileOnly ? 'justify-center' : 'justify-start'
        }`}
      >
        <div className="flex flex-column">
          {isMobileOnly ? (
            <Select
              defaultValue={selectedTabOptions[0]}
              value={selectedTabOnSelect}
              options={selectedTabOptions}
              onChange={handleSelectChange}
              isSearchable={false}
              isClearable={false}
            />
          ) : (
            <div className="flex items-center">
              <div
                className="flex items-center"
                onClick={() => {
                  setSelectedTab(1);
                  setFilterOption(1);
                }}
              >
                <h5
                  className={`${selectedTab === 1 ? 'active' : ''}`}
                >
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
                <h5
                  className={`${selectedTab === 2 ? 'active' : ''}`}
                >
                  Tomorrow
                </h5>
                <span
                  style={{
                    color: selectedTab === 2 ? '#000' : '#a4a4a4',
                    margin: '0 .25rem',
                  }}
                >
                  ({tomorrowTasks.totalTasks})
                </span>
              </div>
              <span className="divider">|</span>
              <div
                className="flex items-center"
                onClick={() => {
                  setSelectedTab(3);
                  setFilterOption(1);
                }}
              >
                <h5
                  className={`${selectedTab === 3 ? 'active' : ''}`}
                >
                  Upcoming
                </h5>
                <span
                  style={{
                    color: selectedTab === 3 ? '#000' : '#a4a4a4',
                    margin: '0 .25rem',
                  }}
                >
                  ({upcomingTasks.totalTasks})
                </span>
              </div>
              <span className="divider">|</span>
              <div
                className="flex items-center"
                onClick={() => {
                  setSelectedTab(4);
                  setFilterOption(1);
                }}
              >
                <h5
                  className={`${selectedTab === 4 ? 'active' : ''}`}
                >
                  Due Tasks
                </h5>
                <span
                  style={{
                    color: selectedTab === 4 ? '#000' : '#a4a4a4',
                    margin: '0 .25rem',
                  }}
                >
                  ({dueTasks.totalTasks})
                </span>
              </div>
            </div>
          )}
          <div
            className="flex items-center"
            style={{ paddingTop: '.7rem' }}
          >
            <p
              className={`${filterOption === 1 ? 'active' : ''}`}
              onClick={() => setFilterOption(1)}
            >
              Assigned to me {showStar(true)}
            </p>
            <span className="divider">|</span>
            <p
              className={`${filterOption === 2 ? 'active' : ''}`}
              onClick={() => setFilterOption(2)}
            >
              Assigned by me {showStar(false)}
            </p>
          </div>
        </div>
      </div>
      <div className="tasks-list w-100">
        {loading ? (
          <div className="flex justify-center mt2 w-100">
            <CircularProgress
              style={{ color: 'rgb(48, 48, 83)' }}
              size={26}
            />
          </div>
        ) : tasks.length > 0 ? (
          <>
            <Table
              order={order}
              setOrder={setOrder}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              selected={selected}
              setSelected={setSelected}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              tasks={tasks}
              assignedByUser={filterOption === 2 ? true : false}
            />
          </>
        ) : (
          <div className="w-100 tc gray mt2">
            Create some task in board!
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
