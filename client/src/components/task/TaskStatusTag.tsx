import { ITaskStatus } from 'stores/task/Reducer';

interface ITaskStatusTag {
  status: ITaskStatus;
}

const TaskStatusTag = (props: ITaskStatusTag) => {
  return (
    <span
      className="bp3-tag ttc"
      style={{
        background:
          props.status.name === 'done'
            ? '#2EB67D'
            : props.status.name === 'in-progress'
            ? '#08A0F7'
            : '#FFA800',
      }}
    >
      {props.status.name.replace(/-/g, ' ')}
    </span>
  );
};

export default TaskStatusTag;
