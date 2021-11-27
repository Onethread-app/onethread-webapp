interface Props {
  setShowEditTaskDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowDeleteTaskDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const TaskTableOptions = (props: Props) => {
  return (
    <div className="flex flex-column">
      {/* <div
        onClick={(e) => {
          e.stopPropagation();
          props.setShowEditTaskDialog(true);
        }}
      >
        Edit
      </div> */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          props.setShowDeleteTaskDialog(true);
        }}
        className="mt1 pointer"
      >
        Delete
      </div>
    </div>
  );
};

export default TaskTableOptions;
