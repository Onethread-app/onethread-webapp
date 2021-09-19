import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import moment from 'moment';

import TaskPriorityTag from 'components/task/TaskPriorityTag';

export const TaskItemContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem;
  max-height: 56px;
  height: 56px;
  cursor: pointer;
  border: 1px solid#e5e5e5;
  &:first-child {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:hover {
    background: #e5e5e57d;
  }
`;

const TaskPortion = styled.div`
  h3 {
    display: inline-block;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  &:first-child {
    width: 30%;
    display: flex;
    align-items: center;
  }

  &:nth-child(2) {
    width: 15% !important;
  }

  &:not(:first-child) {
    width: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:last-child {
    width: 20%;
    justify-content: flex-end !important;
  }
`;

const TaskLitsItem = (props: any) => {
  const { task } = props;
  const history = useHistory();

  return (
    <>
      <TaskItemContainer
        onClick={() => history.push(task.redirectTo.toString())}
      >
        <TaskPortion>
          <h3 className="truncate pr3">{task.name}</h3>
        </TaskPortion>
        <TaskPortion>
          <h3 className="truncate pr3">{task.projectName}</h3>
        </TaskPortion>
        <TaskPortion>
          <TaskPriorityTag priority={task.priority} />
        </TaskPortion>
        <TaskPortion>
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
            {task.status.toString().replace(/-/g, ' ').toUpperCase()}
          </span>
        </TaskPortion>
        <TaskPortion>
          {task.dueDate ? (
            <p>{moment(task.dueDate).format('MMM DD, YYYY')}</p>
          ) : (
            <p>Not set</p>
          )}
        </TaskPortion>
      </TaskItemContainer>
    </>
  );
};

export default TaskLitsItem;
