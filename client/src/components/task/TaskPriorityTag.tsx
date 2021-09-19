import { find } from 'lodash';

import { priorityColor } from 'stores/UtilsActions';

interface ITaskPriorityTag {
  priority: number;
}

const TaskPriorityTag = (props: ITaskPriorityTag) => {
  const { priority } = props;
  return (
    <span
      className="bp3-tag ttu"
      style={{
        background: find(priorityColor, ['code', priority])!.value,
      }}
    >
      {find(priorityColor, ['code', priority])!.name}
    </span>
  );
};

export default TaskPriorityTag;
