import React, { useEffect, useState } from 'react';
import { ITask, IColumn } from 'stores/task/Reducer';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { dragAndDropTask } from 'stores/task/Actions';

interface ISelectOption {
  value: string;
  label: string;
}

interface TaskInfoInternalProps {
  currentTask?: ITask;
  columns: IColumn[];
  dragAndDropTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    taskIndexOfDestinationColumn: number,
  ) => void;
}

const TagSelect = styled.select`
  background-color: ${(props) =>
    props.status === 'done'
      ? '#2EB67D'
      : props.status === 'in-progress'
      ? '#08A0F7'
      : '#FFA800'};
  color: #f5f8fa;
  border: none;
  border-radius: 3px;
  padding: 0.3rem 0.5rem;
  margin: 0;
  width: auto;
  min-width: 11rem;
  max-width: 115px;
  font-family: inherit;
  font-size: 14px;
  cursor: inherit;
  line-height: inherit;
`;

const TaskStatusEdiorComponent = (props: TaskInfoInternalProps) => {
  const { columns, currentTask } = props;
  const [statusOptions, setStatusOptions] = useState<ISelectOption[]>(
    [],
  );

  const [selectedOption, setSelectedOption] = useState<ISelectOption>(
    {
      value: '',
      label: '',
    },
  );

  useEffect(() => {
    if (currentTask?.columnId && currentTask?.status) {
      setSelectedOption({
        value: currentTask!.columnId!,
        label: currentTask!.status.toLowerCase().split('-').join(' '),
      });
    }
  }, [currentTask]);

  useEffect(() => {
    if (currentTask?.status) {
      setSelectedOption((prev) => {
        return {
          ...prev,
          label: currentTask!.status
            .toLowerCase()
            .split('-')
            .join(' '),
        };
      });
    }
  }, [currentTask!.status]);

  useEffect(() => {
    if (currentTask?.columnId) {
      setSelectedOption((prev) => {
        return {
          ...prev,
          value: currentTask!.columnId!,
        };
      });
    }
  }, [currentTask!.columnId]);

  useEffect(() => {
    if (columns) {
      const statusFromColumnName = columns.map((col) => {
        return {
          value: col._id,
          label: col.name,
        };
      });
      setStatusOptions(statusFromColumnName);
    }
  }, [columns]);

  const handleStatusClick = (e) => {
    e.stopPropagation();
  };

  const handleStatusChange = async (e) => {
    const selected = statusOptions.filter(
      (op) => op.value === e.target.value,
    );

    if (selected[0]) {
      setSelectedOption(selected[0]);
      await props.dragAndDropTask(
        currentTask!._id,
        currentTask!.columnId,
        e.target.value,
        0,
      );
    }
  };
  return (
    <div className="task-info-items">
      <h1 className="f6">Status:</h1>
      <TagSelect
        name="status"
        id="boardTagStatus"
        status={selectedOption.label
          .toLowerCase()
          .split(' ')
          .join('-')}
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
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
    columns: state.taskIndexReducer.taskReducer.currentBoard.columns,
  };
};

export const TaskStatusEdior = connect(mapStateToProps, {
  dragAndDropTask,
})(TaskStatusEdiorComponent);
