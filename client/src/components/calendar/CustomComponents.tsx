import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { priorityColor } from 'stores/UtilsActions';

const CustomComponents = {
  eventWrapper: (history) => (eventWrapperProps) => {
    const task = eventWrapperProps.event;
    const pColor: any = priorityColor.find(
      (c) => c.code === task.priority,
    );
    const location = useLocation();

    return (
      <Link
        to={{
          pathname: `/task/${task._id}`,
          state: { background: location },
        }}
      >
        <div
          className="rbc-task-style"
          style={{ borderRight: `7px solid ${pColor.value}` }}
        >
          {task.name}
        </div>
      </Link>
    );
  },
};

export default CustomComponents;
