import React, { useState, useEffect } from 'react';

import TaskItem from './TaskItem';

import { Button } from '@blueprintjs/core';

import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';

const DueTasks = () => {
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [assignedToMe, setAssignedToMe] = useState<any>([]);
  const [assignedByMe, setAssignedByMe] = useState<any>([]);

  useEffect(() => {
    const getTasks = async () => {
      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        const response = await tigrowApi.get(
          `accounts/due-task`,
          headers,
        );
        setAssignedToMe(response.data.assignToUserDue);
        setAssignedByMe(response.data.assignByUserDue);
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
    console.log(loading);
  }, [loading]);
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
            Assigned to me {assignedToMe.length > 0 && '*'}
          </p>
          <span className="divider-small">|</span>
          <p
            className={`${filterOption === 2 ? 'active' : ''}`}
            onClick={() => setFilterOption(2)}
          >
            Assigned by me {assignedByMe.length > 0 && '*'}
          </p>
        </div>
      </div>
      <div className="tasks-list w-100">
        <div className="header flex w-100">
          <div className="w-20">No.</div>
          <div className="w-80">Task Name</div>
        </div>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskItem task={task} index={index} mini key={index} />
          ))
        ) : (
          <div className="w-100 tc gray mt2">No Task</div>
        )}
      </div>
      {tasks.length > 4 && (
        <div className="flex justify-end items-center">
          <Button
            small
            disabled
            className="pointer  mr2"
            style={{
              minWidth: '20px',
              minHeight: '20px',
              padding: '2px 6px',
            }}
          >
            prev
          </Button>
          <Button
            small
            className="pointer"
            style={{
              minWidth: '20px',
              minHeight: '20px',
              padding: '2px 6px',
            }}
          >
            next
          </Button>
        </div>
      )}
    </div>
  );
};

export default DueTasks;
