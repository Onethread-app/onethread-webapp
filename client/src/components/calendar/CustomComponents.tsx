import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const CustomComponents = {
  eventWrapper: (history) => (eventWrapperProps) => {
    const task = eventWrapperProps.event;
    const location = useLocation();

    return (
      <Link
        to={{
          pathname: `/task/${task._id}`,
          state: { background: location },
        }}
      >
        {task.title}
      </Link>
    );
  },
};

export default CustomComponents;
