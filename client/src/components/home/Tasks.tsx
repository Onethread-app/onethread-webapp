import { tigrowApi } from 'config';
import { sortTasks } from 'helpers/utils';
import React, { useEffect, useState } from 'react';
import { tokenConfig } from 'stores/UtilsActions';
import Table from './TaskTable';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  const [upcomingTasks, setUpcomingTasks] = useState<any>([]);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>(
    'deadline',
  );
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
    console.log({ task });
    return task.map((t, i) => ({
      no: i + 1,
      taskName: t.taskId.name,
      assignee:
        t.assignedPerson.firstName + ' ' + t.assignedPerson.lastName,
      deadline: ISOformat(t.taskId.dueDate),
      status: t.taskId.status,
      redirectTo: `/company/${t.taskId.project.company.uniqueName}/project/${t.taskId.project._id}/board/${t.taskId.boardId._id}/task/${t.taskId._id}`,
    }));
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
        setTasks(mdfy(sortTasks(upcomingTasks.assignToUser)));
      }
      if (selectedTab === 2 && filterOption === 2) {
        setTasks(mdfy(sortTasks(upcomingTasks.assignByUser)));
      }
    }
  }, [
    todaysTasks,
    upcomingTasks,
    filterOption,
    selectedTab,
    loading,
  ]);

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
          <div
            className="flex items-center"
            style={{ paddingTop: '.4rem' }}
          >
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
