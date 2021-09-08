import React, { useEffect, useState } from 'react';
import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
import { sortBy } from 'lodash';
import TaskListContainer from './TaskListContainer';
// import CircularProgress from '@material-ui/core/CircularProgress';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { Icon, Popover } from '@blueprintjs/core';
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'react-redux';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const SortingDiv = styled.div`
  display: flex;
  width: fit-content;
  color: #a4a4a4;
  font-size: 12px;
  font-weight: 600;
  line-height: 150%;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  p {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  span {
    color: #656565;
    cursor: pointer;
  }
`;

const TasksComponent = (props: any) => {
  const userId = props!.user!._id;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any>([]);
  const [tasksAll, setTasksAll] = useState<any>([]);
  const [sortedBy, setSortedBy] = useState('');
  const [orderBy, setOrderBy] = useState('asc');
  const [assign, setAssign] = useState('');
  const [day, setDay] = useState('');
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);

  const mdfy = (task) => {
    const taskList = task.map((t) => ({
      name: t.taskId.name,
      assignee:
        t.assignedPerson.firstName + ' ' + t.assignedPerson.lastName,
      accountId: t.account._id,
      assignedPersonId: t.assignedPerson._id,
      dueDate: t.taskId.dueDate,
      status: t.taskId.status,
      redirectTo: `/company/${t.taskId.project.company.uniqueName}/project/${t.taskId.project._id}/board/${t.taskId.boardId._id}/task/${t.taskId._id}`,
      projectName: t.taskId.project.name,
      companyName: t.taskId.project.company.name,
      _id: t.taskId._id,
      priority: t.taskId.priority,
    }));
    return taskList;
  };

  const sortTasksByDueDate = (tasks, orderBy) => {
    setTasks([]);
    return tasks.sort((a, b) => {
      if (a.dueDate < b.dueDate) return orderBy === 'asc' ? 1 : -1;
      else if (a.dueDate > b.dueDate)
        return orderBy === 'asc' ? -1 : 1;
      else return 0;
    });
  };

  const sortTasksByPriority = (tasks, orderBy) => {
    setTasks([]);
    return tasks.sort((a, b) =>
      orderBy === 'asc'
        ? a.priority - b.priority
        : b.priority - a.priority,
    );
  };

  const sortTasksByStatus = (tasks: any, orderBy: any) => {
    setTasks([]);
    const primaryStatus = ['in-progress', 'to-do', 'done'];
    const sortedTasks = sortBy(tasks, (task) => {
      if (orderBy === 'asc') {
        const rank = {
          'in-progress': 1,
          'to-do': 3,
          other: 2,
        };
        return primaryStatus.includes(task.status)
          ? rank[task.status]
          : rank['other'];
      }
      if (orderBy === 'desc') {
        const rank = {
          'in-progress': 3,
          other: 2,
          'to-do': 1,
        };
        return primaryStatus.includes(task.status)
          ? rank[task.status]
          : rank['other'];
      }
    });
    return sortedTasks;
  };

  const sortTasksByTodayDay = async (tasks, assign) => {
    setTasks([]);
    const today = moment(new Date()).format('MMM DD');
    let todaysTasks: any = [];
    await tasks.map((task: any) => {
      const dueDate = moment(task.dueDate).format('MMM DD');
      if (assign === 'to-me') {
        if (
          task.assignedPersonId === userId &&
          task.dueDate &&
          dueDate === today
        ) {
          todaysTasks.push(task);
        }
      } else if (assign === 'by-me') {
        if (
          task.accountId === userId &&
          task.assignedPersonId !== userId &&
          task.dueDate &&
          dueDate === today
        ) {
          todaysTasks.push(task);
        }
      } else {
        if (task.dueDate && dueDate === today) {
          todaysTasks.push(task);
        }
      }
    });
    setTasks(todaysTasks);
  };

  const sortTasksByUpcomming = async (tasks, assign) => {
    setTasks([]);
    const tomorrow = moment(new Date())
      .add(1, 'days')
      .format('MMM DD');

    let upcommingTasks: any = [];
    await tasks.map((task: any) => {
      const dueDate = moment(task.dueDate).format('MMM DD');
      if (assign === 'to-me') {
        if (
          task.assignedPersonId === userId &&
          task.dueDate &&
          dueDate > tomorrow
        ) {
          upcommingTasks.push(task);
        }
      } else if (assign === 'by-me') {
        if (
          task.accountId === userId &&
          task.assignedPersonId !== userId &&
          task.dueDate &&
          dueDate > tomorrow
        ) {
          upcommingTasks.push(task);
        }
      } else {
        if (task.dueDate && dueDate > tomorrow) {
          upcommingTasks.push(task);
        }
      }
    });
    setTasks(upcommingTasks);
  };

  const sortTasksByTomorrow = async (tasks, assign) => {
    setTasks([]);
    const tomorrow = moment(new Date())
      .add(1, 'days')
      .format('MMM DD');

    let tomorrowTasks: any = [];
    await tasks.map((task: any) => {
      const dueDate = moment(task.dueDate).format('MMM DD');
      if (assign === 'to-me') {
        if (
          task.assignedPersonId === userId &&
          task.dueDate &&
          dueDate === tomorrow
        ) {
          tomorrowTasks.push(task);
        }
      } else if (assign === 'by-me') {
        if (
          task.accountId === userId &&
          task.assignedPersonId !== userId &&
          task.dueDate &&
          dueDate === tomorrow
        ) {
          tomorrowTasks.push(task);
        }
      } else {
        if (dueDate === tomorrow) {
          tomorrowTasks.push(task);
        }
      }
    });
    setTasks(tomorrowTasks);
  };

  const sortTasksByDueTasks = async (tasks, assign) => {
    setTasks([]);
    const today = moment(new Date()).format('MMM DD');
    let dueTasks: any = [];
    await tasks.map((task: any) => {
      const dueDate = moment(task.dueDate).format('MMM DD');
      if (assign === 'to-me') {
        if (
          task.assignedPersonId === userId &&
          task.dueDate &&
          dueDate < today
        ) {
          dueTasks.push(task);
        }
      } else if (assign === 'by-me') {
        if (
          task.accountId === userId &&
          task.assignedPersonId !== userId &&
          task.dueDate &&
          dueDate < today
        )
          dueTasks.push(task);
      } else {
        if (task.dueDate && dueDate < today) {
          dueTasks.push(task);
        }
      }
    });
    setTasks(dueTasks);
  };

  const sortByAssignToUser = async (tasks) => {
    setTasks([]);
    let assignToUser: any = [];
    await tasks.map((task: any) => {
      if (task.assignedPersonId === userId) {
        assignToUser.push(task);
      }
    });
    setTasks(assignToUser);
  };

  const sortByAssignByUser = async (tasks) => {
    setTasks([]);
    let assignByUser: any = [];
    await tasks.map((task: any) => {
      if (
        task.accountId === userId &&
        task.assignedPersonId !== userId
      ) {
        assignByUser.push(task);
      }
    });
    setTasks(assignByUser);
  };

  const closePopover = () => {
    setFilterPopoverOpen(false);
    setSortPopoverOpen(false);
  };

  const clearSort = () => {
    setDay('');
    setSortedBy('');
    setAssign('');
    const initialSortedTasks = sortTasksByStatus(
      mdfy(tasksAll),
      'asc',
    );
    setTasks(initialSortedTasks);
  };

  const filterPopover = () => {
    setFilterPopoverOpen(!filterPopoverOpen);
    setSortPopoverOpen(false);
  };

  const sortPopover = () => {
    setSortPopoverOpen(!sortPopoverOpen);
    setFilterPopoverOpen(false);
  };

  useEffect(() => {
    const getTasks = async () => {
      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        const response = await tigrowApi.get(
          `accounts/task-list?date=${new Date()}`,
          headers,
        );
        setTasksAll(response.data);
        setLoading(false);
      }
    };
    getTasks();
  }, []);

  useEffect(() => {
    if (loading === false) {
      if (assign === 'to-me') {
        sortByAssignToUser(mdfy(tasksAll));
      }
      if (assign === 'by-me') {
        sortByAssignByUser(mdfy(tasksAll));
      }
      if (day === 'today') {
        sortTasksByTodayDay(mdfy(tasksAll), assign);
      }
      if (day === 'tomorrow') {
        sortTasksByTomorrow(mdfy(tasksAll), assign);
      }
      if (day === 'upcomming') {
        sortTasksByUpcomming(mdfy(tasksAll), assign);
      }
      if (day === 'due') {
        sortTasksByDueTasks(mdfy(tasksAll), assign);
      } else {
        const initialSortedTasks = sortTasksByStatus(
          mdfy(tasksAll),
          'asc',
        );
        setTasks(initialSortedTasks);
      }
    }
  }, [assign, tasksAll, loading, day]);

  useEffect(() => {
    if (sortedBy === 'dueDate') {
      setTasks(sortTasksByDueDate([...tasks], orderBy));
    }
    if (sortedBy === 'priority') {
      setTasks(sortTasksByPriority([...tasks], orderBy));
    }
    if (sortedBy === 'status') {
      setTasks(sortTasksByStatus([...tasks], orderBy));
    }
  }, [sortedBy, orderBy]);

  return (
    <div className="tasks">
      <div className="flex justify-between items-center filter-option">
        <h3 className="f3 fw2 ttc">My tasks</h3>
        <div className="flex items-center justify-between items-center">
          {sortedBy !== '' || assign !== '' || day !== '' ? (
            <ClearOutlinedIcon
              className="pointer ba br2 mr2 grow"
              style={{
                color: '#656565',
                borderColor: '#656565',
              }}
              onClick={clearSort}
            />
          ) : null}

          <SortingDiv className="flex items-center justify-between">
            <Popover
              isOpen={sortPopoverOpen}
              interactionKind="click"
              position="bottom"
              popoverClassName="bg-white"
              content={
                <ClickAwayListener onClickAway={closePopover}>
                  <div className="bg-white ma3">
                    <div
                      className="flex items-center pointer mb2"
                      style={{
                        marginRight:
                          sortedBy === 'dueDate' ? '8px' : '20px',
                      }}
                    >
                      <Icon
                        icon={
                          sortedBy === 'dueDate'
                            ? 'tick-circle'
                            : 'circle'
                        }
                        iconSize={16}
                        className="mr2"
                        color={
                          sortedBy === 'dueDate'
                            ? '#2EB67D'
                            : 'inherit'
                        }
                        onClick={() =>
                          sortedBy === 'dueDate'
                            ? setSortedBy('')
                            : setSortedBy('dueDate')
                        }
                      />
                      <p
                        className="mb0 mr1"
                        onClick={() =>
                          sortedBy === 'dueDate'
                            ? setSortedBy('')
                            : setSortedBy('dueDate')
                        }
                      >
                        Due Date
                      </p>
                      {sortedBy === 'dueDate' && (
                        <>
                          {orderBy === 'asc' && (
                            <Icon
                              iconSize={12}
                              icon={'arrow-up'}
                              onClick={() => setOrderBy('desc')}
                            />
                          )}
                          {orderBy === 'desc' && (
                            <Icon
                              iconSize={12}
                              icon={'arrow-down'}
                              onClick={() => setOrderBy('asc')}
                            />
                          )}
                        </>
                      )}
                    </div>
                    <div
                      className="flex items-center pointer mb2"
                      style={{
                        marginRight:
                          sortedBy === 'priority' ? '8px' : '20px',
                      }}
                    >
                      <Icon
                        icon={
                          sortedBy === 'priority'
                            ? 'tick-circle'
                            : 'circle'
                        }
                        iconSize={16}
                        className="mr2"
                        color={
                          sortedBy === 'priority'
                            ? '#2EB67D'
                            : 'inherit'
                        }
                        onClick={() =>
                          sortedBy === 'priority'
                            ? setSortedBy('')
                            : setSortedBy('priority')
                        }
                      />
                      <p
                        className="mb0 mr1"
                        onClick={() =>
                          sortedBy === 'priority'
                            ? setSortedBy('')
                            : setSortedBy('priority')
                        }
                      >
                        Priority
                      </p>
                      {sortedBy === 'priority' && (
                        <>
                          {orderBy === 'asc' && (
                            <Icon
                              iconSize={12}
                              icon={'arrow-up'}
                              onClick={() => setOrderBy('desc')}
                            />
                          )}
                          {orderBy === 'desc' && (
                            <Icon
                              iconSize={12}
                              icon={'arrow-down'}
                              onClick={() => setOrderBy('asc')}
                            />
                          )}
                        </>
                      )}
                    </div>
                    <div
                      className="flex items-center pointer mb2"
                      style={{
                        marginRight:
                          sortedBy === 'status' ? '8px' : '20px',
                      }}
                    >
                      <Icon
                        icon={
                          sortedBy === 'status'
                            ? 'tick-circle'
                            : 'circle'
                        }
                        iconSize={16}
                        className="mr2"
                        color={
                          sortedBy === 'status'
                            ? '#2EB67D'
                            : 'inherit'
                        }
                        onClick={() =>
                          sortedBy === 'status'
                            ? setSortedBy('')
                            : setSortedBy('status')
                        }
                      />
                      <p
                        className="mb0 mr1"
                        onClick={() =>
                          sortedBy === 'status'
                            ? setSortedBy('')
                            : setSortedBy('status')
                        }
                      >
                        Status
                      </p>
                      {sortedBy === 'status' && (
                        <>
                          {orderBy === 'asc' && (
                            <Icon
                              iconSize={12}
                              icon={'arrow-up'}
                              onClick={() => setOrderBy('desc')}
                            />
                          )}
                          {orderBy === 'desc' && (
                            <Icon
                              iconSize={12}
                              icon={'arrow-down'}
                              onClick={() => setOrderBy('asc')}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </ClickAwayListener>
              }
              target={
                <div
                  className="flex items-center mr3"
                  onClick={sortPopover}
                >
                  <Icon
                    icon="sort-desc"
                    className="mr1"
                    iconSize={12}
                  />
                  <p>Sort</p>
                </div>
              }
            />
            <Popover
              isOpen={filterPopoverOpen}
              interactionKind="click"
              position="bottom"
              popoverClassName="bg-white"
              content={
                <ClickAwayListener onClickAway={closePopover}>
                  <div className="bg-white ma3">
                    <p
                      className="flex items-center pointer"
                      onClick={() =>
                        day === 'today' ? setDay('') : setDay('today')
                      }
                      style={{
                        marginRight: day === 'today' ? '8px' : '20px',
                      }}
                    >
                      <Icon
                        icon={
                          day === 'today' ? 'tick-circle' : 'circle'
                        }
                        iconSize={16}
                        className="mr2"
                        color={
                          day === 'today' ? '#2EB67D' : 'inherit'
                        }
                      />
                      Today's Task
                    </p>
                    <p
                      className="flex items-center pointer"
                      onClick={() =>
                        day === 'tomorrow'
                          ? setDay('')
                          : setDay('tomorrow')
                      }
                      style={{
                        marginRight:
                          day === 'tomorrow' ? '8px' : '20px',
                      }}
                    >
                      <Icon
                        icon={
                          day === 'tomorrow'
                            ? 'tick-circle'
                            : 'circle'
                        }
                        iconSize={16}
                        className="mr2"
                        color={
                          day === 'tomorrow' ? '#2EB67D' : 'inherit'
                        }
                      />
                      Tomorrow's Task
                    </p>
                    <p
                      className="flex items-center pointer"
                      onClick={() =>
                        day === 'upcomming'
                          ? setDay('')
                          : setDay('upcomming')
                      }
                      style={{
                        marginRight:
                          day === 'upcomming' ? '8px' : '20px',
                      }}
                    >
                      <Icon
                        icon={
                          day === 'upcomming'
                            ? 'tick-circle'
                            : 'circle'
                        }
                        iconSize={16}
                        className="mr2"
                        color={
                          day === 'upcomming' ? '#2EB67D' : 'inherit'
                        }
                      />
                      Upcoming Task
                    </p>
                    <p
                      className="flex items-center pointer"
                      onClick={() =>
                        day === 'due' ? setDay('') : setDay('due')
                      }
                      style={{
                        marginRight: day === 'due' ? '8px' : '20px',
                      }}
                    >
                      <Icon
                        icon={
                          day === 'due' ? 'tick-circle' : 'circle'
                        }
                        iconSize={16}
                        className="mr2"
                        color={day === 'due' ? '#2EB67D' : 'inherit'}
                      />
                      Due Task
                    </p>
                    <p
                      className="flex items-center pointer"
                      onClick={() =>
                        assign === 'to-me'
                          ? setAssign('')
                          : setAssign('to-me')
                      }
                      style={{
                        marginRight:
                          assign === 'to-me' ? '8px' : '20px',
                      }}
                    >
                      <Icon
                        icon={
                          assign === 'to-me'
                            ? 'tick-circle'
                            : 'circle'
                        }
                        iconSize={16}
                        className="mr2"
                        color={
                          assign === 'to-me' ? '#2EB67D' : 'inherit'
                        }
                      />
                      Assigned to me
                    </p>
                    <p
                      className="mr2 flex items-center pointer"
                      onClick={() =>
                        assign === 'by-me'
                          ? setAssign('')
                          : setAssign('by-me')
                      }
                      style={{
                        marginRight:
                          assign === 'by-me' ? '8px' : '20px',
                      }}
                    >
                      <Icon
                        icon={
                          assign === 'by-me'
                            ? 'tick-circle'
                            : 'circle'
                        }
                        iconSize={16}
                        className="mr2"
                        color={
                          assign === 'by-me' ? '#2EB67D' : 'inherit'
                        }
                      />
                      Assigned by me
                    </p>
                  </div>
                </ClickAwayListener>
              }
              target={
                <div
                  className="mr2 flex items-center"
                  onClick={filterPopover}
                >
                  <Icon icon="filter" className="mr1" iconSize={12} />
                  <p>Filter</p>
                </div>
              }
            />
          </SortingDiv>
        </div>
      </div>
      <div className="tasks-list w-100">
        <TaskListContainer tasks={tasks} loading={loading} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const Tasks = connect(mapStateToProps)(TasksComponent);
