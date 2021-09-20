interface IStatusTag {
  status: string;
}

const StatusTag = (props: IStatusTag) => {
  return (
    <span
      className={`bp3-tag ttc ${
        props.status === 'not-started'
          ? 'bg-blue'
          : props.status === 'ongoing'
          ? 'bg-orange'
          : 'bg-green'
      }`}
    >
      {props.status.replace(/-|\s/g, ' ')}
    </span>
  );
};

export default StatusTag;
