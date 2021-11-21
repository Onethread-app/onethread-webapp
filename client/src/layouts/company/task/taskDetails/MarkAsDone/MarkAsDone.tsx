import { connect } from 'react-redux';
import styled from 'styled-components';

import { ITask } from 'stores/task/Reducer';
import { updateTask } from 'stores/task/Actions';

interface Props {
  currentTask: ITask;
  updateTask: (payload) => void;
}

export const MarkAsDoneSelect = styled.select`
  background: #f6f6f6;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  margin: 0.5rem 0;
  width: auto;
  min-width: 11rem;
  max-width: 215px;
  font-family: inherit;
  font-size: 14px;
  cursor: inherit;
  line-height: inherit;
  border: 1px solid #b1b1b1;
`;

const TaskStatus = (props: Props) => {
  const handleIsComplete = (e: any) => {
    e.preventDefault();
    props.updateTask({
      taskId: props.currentTask._id,
      companyId: props.currentTask.company._id,
      projectId: props.currentTask.project._id,
      isCompleted: e.target.value === 'true' ? true : false,
    });
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="f6">Task Status:</h1>
      <MarkAsDoneSelect
        value={String(props.currentTask.isCompleted)}
        onChange={(e) => handleIsComplete(e)}
      >
        <option value="false">Not completed</option>
        <option value="true">Completed</option>
      </MarkAsDoneSelect>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  currentTask: state.taskIndexReducer.taskReducer.currentTask,
});

export default connect(mapStateToProps, { updateTask })(TaskStatus);
