import React from 'react';

import TaskItem from './TaskItem';

import More from 'resources/svg/More.svg';
import { Button } from '@blueprintjs/core';

const OngoingTasks = () => {
  const [tasks] = React.useState([1, 2, 3, 4]);
  return (
    <div className="ongoing-tasks">
      <div className="flex justify-between w-100">
        <div className="flex items-center">
          <h3>Ongoing</h3>
          <span className="ml1">(15)</span>
        </div>
        <div>
          <img src={More} alt="more" className="pointer" />
        </div>
      </div>
      <div className="tasks-list w-100">
        <div className="header flex w-100">
          <div className="w-20">No</div>
          <div className="w-80">Task Name</div>
        </div>
        {tasks.map((task, index) => (
          <TaskItem task={task} index={index} mini />
        ))}
      </div>
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
    </div>
  );
};

export default OngoingTasks;
