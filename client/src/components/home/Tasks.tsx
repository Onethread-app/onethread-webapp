import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';

import TaskItem from './TaskItem';

const Tasks = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [filterOption, setFilterOption] = useState(0);

  const [tasks] = useState([1, 2, 3, 4, 5]);

  return (
    <div className="tasks">
      <div className="tasks-filter flex items-center justify-between">
        <div className="flex flex-column">
          <div className="flex items-center">
            <div
              className="flex items-center"
              onClick={() => {
                setSelectedTab(1);
                setFilterOption(0);
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
                (5)
              </span>
            </div>
            <span className="divider">|</span>
            <div
              className="flex items-center"
              onClick={() => {
                setSelectedTab(2);
                setFilterOption(0);
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
                (15)
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <p
              className={`${filterOption === 1 ? 'active' : ''}`}
              onClick={() => setFilterOption(1)}
            >
              Assign by me
            </p>
            <span className="divider-small">|</span>
            <p
              className={`${filterOption === 2 ? 'active' : ''}`}
              onClick={() => setFilterOption(2)}
            >
              Assigned to me
            </p>
          </div>
        </div>
        <div>
          <AddIcon className="pointer" />
        </div>
      </div>
      <div className="tasks-list w-100">
        <div className="header flex w-100">
          <div className="w-10">No</div>
          <div className="w-60">Task Name</div>
          <div className="w-15 tc">Deadline</div>
          <div className="w-15 tc">Status</div>
        </div>
        {tasks.map((task, index) => (
          <TaskItem task={task} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
