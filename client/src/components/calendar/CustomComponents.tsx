import React from 'react';

import { priorityColor } from 'stores/UtilsActions';

const CustomComponents = {
  eventWrapper: (history) => (eventWrapperProps) => {
    const task = eventWrapperProps.event;
    const pColor: any = priorityColor.find(
      (c) => c.code === task.priority,
    );

    return (
      <div
        className="rbc-task-style"
        style={{ borderRight: `7px solid ${pColor.value}` }}
        onClick={() => history.push(task.redirectTo)}
      >
        {task.name}
      </div>
    );
  },
};

export default CustomComponents;
