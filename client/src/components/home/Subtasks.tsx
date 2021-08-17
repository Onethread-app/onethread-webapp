import React from 'react';

import SubtaskItem from 'components/subtask/SubtaskItem';

import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';

const Subtasks = () => {
  const [subTasks, setSubtasks] = React.useState<any>([]);

  React.useEffect(() => {
    const getUsersSubtasks = async () => {
      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        const response = await tigrowApi.get(
          `accounts/subtasks`,
          headers,
        );
        setSubtasks(response.data);
      }
    };
    getUsersSubtasks();
  }, []);

  return (
    <div className="subtasks">
      <h3>Subtasks</h3>
      <div className="subtasks-list mt2 pa1">
        <div className="flex items-center justify-between mb2 f5 bb">
          <div>Name</div>
          <div className="flex items-center">
            <div className="mr3" style={{ maxWidth: '100px' }}>
              Project
            </div>
            <div
              className="flex justify-end mr3"
              style={{ width: '100px' }}
            >
              Deadline
            </div>
          </div>
        </div>
        {subTasks.map((subtask) => {
          return <SubtaskItem subtask={subtask} key={subtask._id} />;
        })}
      </div>
    </div>
  );
};

export default Subtasks;
