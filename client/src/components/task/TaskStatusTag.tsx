interface ITaskStatusTag {
  status: string;
}

const TaskStatusTag = (props: ITaskStatusTag) => (
  <span
    className='bp3-tag ttc'
    style={{
      background:
          props.status === 'done'
            ? '#2EB67D'
            : props.status === 'in-progress'
              ? '#08A0F7'
              : '#FFA800',
    }}
  >
    {props.status.replace(/-/g, ' ')}
  </span>
);

export default TaskStatusTag;
