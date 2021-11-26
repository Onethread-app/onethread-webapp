import { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import { ISubTask } from 'stores/subtask/Reducer';

import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
import { ITask } from 'stores/task/Reducer';
import { createSubTask, updateTask } from 'stores/task/Actions';
import { errorToaster } from 'components/toast/Toaster';

interface ITaskDescriptionCreateFormProps {
  setShowSubTaskForm: (val: boolean) => void;
  showSubtaskForm: boolean;
  createSubTask: (subTask) => void;
  errorOnCreatingSubTask: string;
  subtask?: ITask;
  setsubtask: (subTask: ISubTask) => void;
  updateTask: (subTask) => void;
  creatingSubTask: boolean;
  updatingSubTask: boolean;
  currentTask: ITask;
}
interface ISubTaskDescriptionDeleteFormProps {
  subTask: ITask;
  deleteSubTask: (subTask) => void;
}

export const SubTaskCreatorComponent = (
  props: ITaskDescriptionCreateFormProps & RouteComponentProps,
) => {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const onSubmit = async (values: any) => {
    if (isEmpty(props.subtask)) {
      const subTaskData = {
        name: values.subtaskTitle,
        description: values.subtaskDesc,
        companyId: props.currentTask.company._id,
        projectId: props.currentTask.project._id,
        taskId: props.currentTask._id,
      };
      props.createSubTask(subTaskData);
      setCreating(true);
    } else {
      const updateSubTaskData = {
        taskId: props.subtask!._id,
        name: values.subtaskTitle,
        description: values.subtaskDesc,
        companyId: props.subtask?.company._id,
        projectId: props.subtask?.project._id,
      };
      props.updateTask(updateSubTaskData);
      setUpdating(true);
    }
  };

  useEffect(() => {
    if (
      creating === true &&
      props.creatingSubTask === false &&
      props.errorOnCreatingSubTask === ''
    ) {
      props.setShowSubTaskForm(!props.showSubtaskForm);
    }
    if (
      creating === true &&
      props.creatingSubTask === false &&
      props.errorOnCreatingSubTask === ''
    ) {
      errorToaster(props.errorOnCreatingSubTask);
      setCreating(false);
    }
  }, [creating, props.creatingSubTask]);

  useEffect(() => {
    if (updating === true && props.creatingSubTask === false) {
      props.setShowSubTaskForm(!props.showSubtaskForm);
    }
  }, [updating, props.creatingSubTask]);

  return (
    <div className="mb3 pa3">
      <h3 className="tc">Create Subtask</h3>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          subtaskTitle: props.subtask ? props.subtask.name : '',
          subtaskDesc: props.subtask ? props.subtask.description : '',
        }}
        render={({
          handleSubmit,
          form,
          submitting,
          pristine,
          values,
          submitError,
          hasValidationErrors,
          ...rest
        }) => (
          <form onSubmit={handleSubmit}>
            <SubmitError errorMessage={submitError} />
            <div className="pt2">
              <Field<string>
                name="subtaskTitle"
                validate={composeValidators(required, maxValue(100))}
                render={({ input, meta }) => (
                  <div>
                    <div
                      className={` ${
                        checkError(meta) ? 'mb3' : 'mb2'
                      }`}
                    >
                      <label htmlFor="subtaskTitle">Name</label>
                      <InputGroupFieldWithError
                        id="subtaskTitle"
                        value={input.value}
                        onChange={input.onChange}
                        className="ba br2"
                      />
                      {checkError(meta) && (
                        <small
                          className="mv3"
                          style={{ color: 'red' }}
                        >
                          {meta.error || meta.submitError}
                        </small>
                      )}
                    </div>
                  </div>
                )}
              />
              <Field<string>
                name="subtaskDesc"
                validate={composeValidators(maxValue(250))}
                render={({ input, meta }) => (
                  <div>
                    <div
                      className={` ${
                        checkError(meta) ? 'mb3' : 'mb2'
                      }`}
                    >
                      <label htmlFor="subtaskDesc">Description</label>
                      <textarea
                        id="subtaskDesc"
                        value={input.value}
                        onChange={input.onChange}
                        className="ba br2 w-100 h3"
                        style={{ flex: '1 1 auto' }}
                      ></textarea>
                      {checkError(meta) && (
                        <small
                          className="mv3"
                          style={{ color: 'red' }}
                        >
                          {meta.error || meta.submitError}
                        </small>
                      )}
                    </div>
                  </div>
                )}
              />
              <div className="flex justify-end mt2">
                <Button
                  type="submit"
                  style={{ background: '#08A0F7' }}
                  loading={submitting}
                  icon={
                    <Icon
                      icon="tick"
                      iconSize={20}
                      style={{ color: 'white' }}
                    />
                  }
                  disabled={submitting || pristine}
                />
                <Button
                  className="ml2"
                  style={{ background: 'transparent' }}
                  icon="cross"
                  onClick={async () => {
                    // props.setsubtask({});
                    props.setShowSubTaskForm(!props.showSubtaskForm);
                  }}
                />
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    creatingSubTask:
      state.taskIndexReducer.taskReducer.creatingSubTask,
    errorOnCreatingSubTask:
      state.taskIndexReducer.taskReducer.errorOnCreatingSubTask,
    updatingSubTask:
      state.taskIndexReducer.subTaskReducer.updatingSubTask,
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
  };
};

export const SubTaskCreator = connect(mapStateToProps, {
  createSubTask,
  updateTask,
})(withRouter(SubTaskCreatorComponent));

export const SubTaskDelete = (
  props: ISubTaskDescriptionDeleteFormProps,
) => {
  const [deletePopover, setDeletePopover] = useState(false);
  return (
    <Popover
      isOpen={deletePopover}
      content={
        <div className="pa3 cf bg-white" style={{ width: '350px' }}>
          <h1 className="f5">Delete</h1>
          <div>
            <p>Are you sure about that ? </p>
            <div className="flex justify-end mt4">
              <Button
                className="grow h2 pointer white bp3-minimal w4 mr3"
                style={{
                  background: '#08A0F7',
                  outline: 'none',
                  color: 'white',
                }}
                // loading={submitting}
                type="submit"
                onClick={() => {
                  props.deleteSubTask({
                    taskId: props.subTask._id,
                    companyId: props.subTask.company._id,
                    projectId: props.subTask.project._id,
                    parentTask: props.subTask.parentTask,
                  });
                  setDeletePopover(false);
                }}
              >
                Yes, Delete
              </Button>
              <Button
                className="grow h2 pointer white bp3-minimal w4"
                style={{
                  background: '#fff',
                  outline: 'none',
                  border: '1px solid #08A0F7',
                  color: '#08A0F7',
                }}
                onClick={() => setDeletePopover(false)}
              >
                No, Keep
              </Button>
            </div>
          </div>
        </div>
      }
      target={
        <Icon
          className="fr mv3 tigrow-lightBlue pointer mr4 pt1"
          style={{ marginTop: 0, color: 'lightsteelblue' }}
          icon="trash"
          onClick={() => setDeletePopover(true)}
        />
      }
    />
  );
};
