import React, { useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';
import TaskListSkeleton from './TaskListSkeleton';
import TaskTableContainer from './TaskTableContainer';
import { Icon, Popover, Menu } from '@blueprintjs/core';
import { priorityColor } from 'stores/UtilsActions';
import { DateRangePicker } from '@blueprintjs/datetime';

const TaskListContainerDiv = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 8px;
  position: relative;
  max-width: 100%;
  margin-bottom: ${isMobileOnly ? '4rem' : 0};
  @media screen and (max-width: 1366px) {
    width: 720px;
  }
  @media screen and (max-width: 1024px) {
    width: 950px;
    overflow-x: auto;
  }
  @media screen and (max-width: 425px) {
    width: 300px;
    overflow-x: auto;
  }
`;

const ListHeader = styled.div`
  display: flex;
  padding: 0 1rem;
  min-width: 680px;
`;

const HeaderItem = styled.div`
  h3 {
    display: inline-block;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  h3:hover {
    font-weight: 700;
    cursor: pointer;
  }

  &:first-child {
    width: 30%;
    display: flex;
    align-items: center;
  }

  &:nth-child(2) {
    width: 15% !important;
  }

  &:not(:first-child) {
    width: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:last-child {
    width: 20%;
    justify-content: flex-end !important;
  }
`;

const mapper = {
  'TASK NAME': 'name',
  PROJECT: 'projectName', // TODO: name change
  PRIORITY: 'priority',
  STATUS: 'status',
  'DUE DATE': 'dueDate',
};

export interface ITaskList {
  accountId: string;
  assignedPersonId: string;
  assignee: string;
  companyName: string;
  dueDate: Date;
  name: string;
  priority: number;
  projectName: string;
  redirectTo: string;
  status: string;
}
interface ITaskListProps {
  loading: boolean;
  tasks: ITaskList[];
  setSortedBy: any;
  setOrderBy: any;
}

const TableHeaderComponent = (props: any) => {
  const [order, setOrder] = useState('asc');
  let {
    headerName,
    setSortedBy,
    setOrderBy,
    dropdownValues,
    filterProperty,
    setFilterProperty,
    showDatePicker = false,
  } = props;
  if (!dropdownValues) dropdownValues = [];

  const onClick = () => {
    setSortedBy(mapper[headerName]);
    setOrderBy(order);
    setOrder((prev: any) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const addIntoFilterList = (fld, value) => {
    setFilterProperty((prev) => {
      const t = prev.slice();
      const idx = t.findIndex((p) => p.name === fld);
      if (idx === -1) {
        t.push({ name: fld, value: [value] });
      } else {
        if (!t[idx].value.some((v) => v === value)) {
          t[idx].value.push(value);
        } else {
          t[idx].value.splice(t[idx].value.indexOf(value), 1);
          if (t[idx].value.length === 0) t.split(idx, 1);
        }
      }
      console.log('135', t);
      return t;
    });
  };

  return (
    <HeaderItem>
      <div style={{ display: 'flex' }}>
        <h3 onClick={onClick} style={{ marginRight: 3 }}>
          {headerName}
        </h3>
        <Popover
          content={
            showDatePicker ? (
              <DateRangePicker
                contiguousCalendarMonths={false}
                shortcuts={false}
              />
            ) : (
              <Menu>
                {dropdownValues.map((item) => (
                  <Menu.Item
                    key={item}
                    icon={
                      filterProperty.find((f) =>
                        f.value.find((v) => v === item),
                      )
                        ? 'tick'
                        : 'square'
                    }
                    text={item}
                    className="ttc"
                    onClick={() =>
                      addIntoFilterList(mapper[headerName], item)
                    }
                  />
                ))}
              </Menu>
            )
          }
        >
          <Icon
            icon="double-caret-vertical"
            style={{ marginTop: 2, cursor: 'pointer' }}
            iconSize={15}
          />
        </Popover>
      </div>
    </HeaderItem>
  );
};

const TaskListContainer = (props: ITaskListProps) => {
  const { loading, tasks, setSortedBy, setOrderBy } = props;
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [filterProperty, setFilterProperty] = useState([]);

  // If type === string, make it lowercase
  const f = (s) => (typeof s === 'string' ? s.toLowerCase() : s);
  // Find Unique And Sort
  const findUnique = (fld) => {
    return Array.from(
      new Set(tasks.map((t) => t[fld])),
    ).sort((a, b) => (f(a) > f(b) ? 1 : -1));
  };
  // Dropdown values
  const taskDropDown = ['Assigned to me', 'Assigned by me'];
  const unqProject = findUnique('projectName');
  const unqPriority = findUnique('priority').map((x) => {
    const res: any = priorityColor.find((p) => p.code === x);
    return res.name;
  });
  const unqStatus = findUnique('status');

  useEffect(() => {
    setFilteredTasks(props.tasks);
  }, [props.tasks]);

  useEffect(() => {
    if (filterProperty.length === 0) {
      console.log('haha');
      setFilteredTasks(props.tasks);
    } else {
      setFilteredTasks(
        props.tasks.filter((t) => {
          const res: any = priorityColor.find(
            (p) => p.code === t.priority,
          );
          const prTask: any = filterProperty.find(
            (f: any) => f.name === 'priority',
          );
          if (prTask) {
            if (!prTask.value.includes(res.name)) return false;
          }

          return true;
        }),
      );
    }
  }, [filterProperty]);

  return loading ? (
    <TaskListSkeleton />
  ) : tasks.length > 0 ? (
    <TaskListContainerDiv>
      <ListHeader>
        <TableHeaderComponent
          headerName={'TASK NAME'}
          setSortedBy={setSortedBy}
          setOrderBy={setOrderBy}
          dropdownValues={taskDropDown}
          filterProperty={filterProperty}
          setFilterProperty={setFilterProperty}
        />
        <TableHeaderComponent
          headerName={'PROJECT'}
          setSortedBy={setSortedBy}
          setOrderBy={setOrderBy}
          dropdownValues={unqProject}
          filterProperty={filterProperty}
          setFilterProperty={setFilterProperty}
        />
        <TableHeaderComponent
          headerName={'PRIORITY'}
          setSortedBy={setSortedBy}
          setOrderBy={setOrderBy}
          dropdownValues={unqPriority}
          filterProperty={filterProperty}
          setFilterProperty={setFilterProperty}
        />
        <TableHeaderComponent
          headerName={'STATUS'}
          setSortedBy={setSortedBy}
          setOrderBy={setOrderBy}
          dropdownValues={unqStatus}
          filterProperty={filterProperty}
          setFilterProperty={setFilterProperty}
        />
        <TableHeaderComponent
          headerName={'DUE DATE'}
          setSortedBy={setSortedBy}
          setOrderBy={setOrderBy}
          showDatePicker={true}
          filterProperty={filterProperty}
          setFilterProperty={setFilterProperty}
        />
      </ListHeader>
      <TaskTableContainer tasks={filteredTasks} />
    </TaskListContainerDiv>
  ) : (
    <div className="w-100 tc gray mt2">
      Create some tasks in board.
    </div>
  );
};

export default TaskListContainer;
