import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';
import moment from 'moment';

import LinearProgress from '@material-ui/core/LinearProgress';

interface ITaskItem {
  task: any;
  index: number;
  mini?: boolean;
}
const TaskItem = (props: ITaskItem) => {
  const [loading, setLoading] = React.useState(true);
  const [assignee, setAssignee] = useState<any | null>(null);
  const [task, setTask] = React.useState({
    _id: '',
    name: '',
    deadline: '',
    status: '',
    projectName: '',
    projectId: '',
    boardId: '',
    companyName: '',
  });
  const history = useHistory();

  React.useEffect(() => {
    if (props.task.taskId) {
      const {
        name,
        dueDate,
        boardId,
        project,
        status,
        _id,
      } = props.task.taskId;
      const { assignedPerson, account } = props.task;
      const assignedPersonId = assignedPerson._id.toString();
      const accountId = account._id.toString();
      if (assignedPersonId === accountId) setAssignee(null);
      else {
        const name = `${assignedPerson.firstName} ${assignedPerson.lastName}`;
        setAssignee(name);
      }
      setTask({
        _id,
        name,
        status,
        deadline: dueDate,
        projectName: project.name,
        projectId: project._id,
        boardId: boardId._id,
        companyName: project.company.uniqueName,
      });
      setLoading(false);
    }
  }, [props.task]);

  const handleClick = () => {
    history.push(
      `/company/${task.companyName}/project/${task.projectId}/board/${task.boardId}/task/${task._id}`,
    );
  };
  return loading ? (
    <div className="task-item w-100">
      <LinearProgress />
    </div>
  ) : (
    <div
      className="task-item flex items-center w-100 pointer"
      onClick={handleClick}
    >
      <div
        className={`${
          isMobileOnly
            ? props.mini
              ? 'w-20'
              : 'w-10'
            : props.mini
            ? 'w-20'
            : 'w-10'
        } self-start`}
      >
        {('0' + (props.index + 1)).slice(-2)}
      </div>
      <div
        className={`${
          isMobileOnly
            ? props.mini
              ? 'w-80'
              : 'w-60'
            : props.mini
            ? 'w-80'
            : 'w-60'
        } flex flex-column`}
      >
        <h3>{task.name}</h3>
        <p>{task.projectName}</p>
      </div>
      {assignee && (
        <div>
          <p>{assignee}</p>
        </div>
      )}
      <div
        className={`${
          isMobileOnly ? 'dn' : props.mini ? 'dn' : 'deadline w-15 tc'
        }`}
      >
        {moment(task.deadline).format('DD/MM/YYYY')}
      </div>
      <div
        className={`${
          isMobileOnly
            ? props.mini
              ? 'dn'
              : 'status w-30 tc'
            : props.mini
            ? 'dn'
            : 'status w-15 tc'
        }`}
      >
        <span
          className="bp3-tag ttc"
          style={{
            background:
              task.status === 'done'
                ? '#2EB67D'
                : task.status === 'in-progress'
                ? '#08A0F7'
                : '#FFA800',
          }}
        >
          {task.status.replace(/-/g, ' ')}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
