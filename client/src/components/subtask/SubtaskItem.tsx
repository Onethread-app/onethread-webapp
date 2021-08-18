import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

interface ISubtaskItemProps {
  subtask: any;
  index: number;
}

const SubtaskItem = (props: ISubtaskItemProps) => {
  const { subtask } = props;
  const history = useHistory();

  const handleClick = () => {
    const taskUrl = `/company/${subtask.taskId.project.company.uniqueName}/project/${subtask.taskId.project._id}/board/${subtask.taskId.boardId._id}/task/${subtask.taskId._id}`;

    history.push(taskUrl);
  };

  return (
    <div
      className="subtask-item flex items-center justify-between pa1 pointer hover-bg-light-gray br2"
      style={{ minWidth: '500px' }}
      onClick={handleClick}
    >
      <div className="flex items-center truncate">
        <span className="mr2">
          {('0' + (props.index + 1)).slice(-2)}.
        </span>
        {subtask.name}
      </div>
      <div className="flex">
        <div
          className="tc truncate mr3"
          style={{ maxWidth: '100px', fontSize: '12px' }}
        >
          {subtask.taskId.name}
        </div>
        <div
          className={'flex items-center justify-end mr3'}
          style={{ width: '100px' }}
        >
          <span
            className="bp3-tag"
            style={{
              backgroundColor:
                moment() > moment(subtask.dueDate)
                  ? 'red'
                  : 'lightsteelblue',
              color:
                moment() > moment(subtask.dueDate)
                  ? '#fff'
                  : 'inherit',
            }}
          >
            {subtask.dueDate
              ? moment(subtask.dueDate).fromNow()
              : 'Not Set'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubtaskItem;
