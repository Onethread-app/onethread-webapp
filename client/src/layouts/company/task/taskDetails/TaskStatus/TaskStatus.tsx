import { connect } from 'react-redux';
import styled from 'styled-components';

import { ITask, ITaskStatus } from 'stores/task/Reducer';
import { updateTask } from 'stores/task/Actions';

interface Props {
  currentTask: ITask;
  updateTask: (payload) => void;
}

export const StyledTaskStatusSelect = styled.select`
  background: #f6f6f6;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  margin: 0;
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
  const handleStatusChange = (e: any) => {
    e.preventDefault();
    props.updateTask({
      taskId: props.currentTask._id,
      companyId: props.currentTask.company._id,
      projectId: props.currentTask.project._id,
      status: e.target.value,
    });
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="f6">Task Status:</h1>
      <StyledTaskStatusSelect
        value={props.currentTask.status?._id}
        onChange={(e) => handleStatusChange(e)}
      >
        {props.currentTask.statusList?.map((status: ITaskStatus) => (
          <option key={status._id} value={status._id}>
            {status.name}
          </option>
        ))}
      </StyledTaskStatusSelect>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  currentTask: state.taskIndexReducer.taskReducer.currentTask,
});

export default connect(mapStateToProps, { updateTask })(TaskStatus);
