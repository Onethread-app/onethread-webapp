import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { updateTaskStatus } from 'stores/task/Actions';
import { ITask } from 'stores/task/Reducer';

const TagSelect = styled.select`
  background-color: ${(props) =>
    props.status === 'done'
      ? '#2EB67D'
      : props.status === 'in-progress'
      ? '#08A0F7'
      : '#FFA800'};
  color: #f5f8fa;
  text-align-last: center;
  border: none;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  margin: 0;
  width: auto;
  max-width: 115px;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
`;

interface ISelectOption {
  value: string;
  label: string;
}

interface ITaskTagSelect {
  task: ITask;
  updateTaskStatus: (payload) => void;
}

const TaskTagSelect = (props: ITaskTagSelect) => {
  const { task } = props;
  const [statusOptions, setStatusOptions] = useState<ISelectOption[]>(
    [],
  );
  const [selectedOption, setSelectedOption] = useState<ISelectOption>(
    {
      value: task.status._id,
      label: task.status.name.toLowerCase().split('-').join(' '),
    },
  );

  const handleStatusClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleStatusChange = (e) => {
    const selected = statusOptions.filter(
      (op) => op.value === e.target.value,
    );
    if (selected[0]) {
      setSelectedOption(selected[0]);
      const payload = {
        ...task,
        status: { _id: selected[0].value, name: selected[0].label },
      };
      console.log(payload);
      props.updateTaskStatus(payload);
    }
  };

  useEffect(() => {
    setSelectedOption({
      label: task.status.name,
      value: task.status._id,
    });
  }, [task.status]);

  useEffect(() => {
    setStatusOptions(
      task.statusList.map((status) => ({
        value: status._id,
        label: status.name,
      })),
    );
  }, [task.statusList]);

  return task.statusList.length === 0 ? (
    <span
      className="bp3-tag ttc"
      style={{
        background:
          task.status.name === 'done'
            ? '#2EB67D'
            : task.status.name === 'in-progress'
            ? '#08A0F7'
            : '#FFA800',
      }}
    >
      {task.status.name}
    </span>
  ) : (
    <TagSelect
      name="status"
      id="boardTagStatus"
      status={selectedOption.label.toLowerCase().split(' ').join('-')}
      onClick={handleStatusClick}
      onChange={handleStatusChange}
      value={selectedOption.value}
    >
      {statusOptions.map((op) => (
        <option value={op.value} key={op.value}>
          {op.label}
        </option>
      ))}
    </TagSelect>
  );
};
export default connect(null, {
  updateTaskStatus,
})(TaskTagSelect);
