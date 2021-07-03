import React from 'react';

interface ITaskItem {
  task: number;
  index: number;
  mini?: boolean;
}
const TaskItem = (props: ITaskItem) => {
  return (
    <div className="task-item flex items-center w-100">
      <div className={`${props.mini ? 'w-20' : 'w-10'} self-start`}>
        {('0' + (props.index + 1)).slice(-2)}
      </div>
      <div
        className={`${props.mini ? 'w-80' : 'w-60'} flex flex-column`}
      >
        <h3 className="pointer">Create Brand Guideline</h3>
        <p>Project name</p>
      </div>
      <div className={`${props.mini ? 'dn' : 'deadline w-15 tc'}`}>
        01/01/2056
      </div>
      <div className={`${props.mini ? 'dn' : 'status w-15 tc'}`}>
        <span className="bp3-tag">In Progress</span>
      </div>
    </div>
  );
};

export default TaskItem;
