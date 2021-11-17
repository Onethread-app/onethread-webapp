import { useState } from 'react';
import { connect } from 'react-redux';

import { ITask } from 'stores/task/Reducer';
import { ICompany } from 'stores/company/Reducer';
import moment from 'moment';
import { TaskTitleEditor } from './TaskTitleEditor';

interface TaskDetailsInternalProps {
  currentTask: ITask;
  company?: ICompany;
}

export const TaskTitleViewComponent = (
  props: TaskDetailsInternalProps,
) => {
  const [nameEdit, setNameEdit] = useState(false);

  return (
    <>
      {nameEdit ? (
        <TaskTitleEditor
          nameEdit={nameEdit}
          setNameEdit={(e) => setNameEdit(!nameEdit)}
          currentTask={props.currentTask}
        />
      ) : (
        <div>
          <h5
            style={{
              fontSize: '12px',
              color: '#666666',
              lineHeight: '0px',
              fontWeight: 400,
              margin: '0.2rem 0rem',
            }}
          >
            TASK
          </h5>
          <h3
            title="Click to edit title"
            className="fw6 mb0 mv2 dim"
            style={{
              cursor: 'text',
              fontSize: '25px',
            }}
            onClick={() => {
              props.company ? setNameEdit(true) : setNameEdit(false);
            }}
          >
            {props.currentTask!.name}
          </h3>
          <h5
            style={{
              fontSize: '14px',
              color: '#666666',
              lineHeight: '15px',
              fontWeight: 400,
              margin: '0.2rem 0rem',
            }}
          >
            Task created by {props.currentTask!.createdBy} at{' '}
            {moment(props.currentTask!.createdAt).format(
              'MMMM d, YYYY',
            )}
          </h5>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
    company: state.companyReducer.currentCompany,
  };
};

export const TaskTitleView = connect(
  mapStateToProps,
  null,
)(TaskTitleViewComponent);
