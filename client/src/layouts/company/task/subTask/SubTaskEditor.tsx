import React, { useState } from 'react';
import { Button, Icon, Popover } from '@blueprintjs/core';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { createSubTask, updateSubTask } from 'stores/subtask/Actions';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ISubTask } from 'stores/subtask/Reducer';
import { isEmpty } from 'lodash';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';

interface ITaskDescriptionCreateFormProps {
  setShowSubTaskForm: (val: boolean) => void;
  showSubtaskForm: boolean;
  createSubTask: (subTask: ISubTask) => void;
  subtask?: ISubTask;
  setsubtask: (subTask: ISubTask) => void;
  updateSubTask: (subTask: ISubTask) => void;
  creatingSubTask: boolean;
  updatingSubTask: boolean;
}
interface ISubTaskDescriptionDeleteFormProps {
  subTask: ISubTask;
  deleteSubTask: (subTask: ISubTask) => void;
}

export const SubTaskCreatorComponent = (
  props: ITaskDescriptionCreateFormProps & RouteComponentProps,
) => {
  const onSubmit = async (values: any) => {
    if (isEmpty(props.subtask)) {
      const subTaskData = {
        name: values.subtaskTitle,
      };
      await props.createSubTask(subTaskData);
      if (props.creatingSubTask === false) {
        props.setShowSubTaskForm(!props.showSubtaskForm);
      }
    } else {
      const updateSubTaskData = {
        _id: props.subtask!._id,
        name: values.subtaskTitle,
      };
      await props.updateSubTask(updateSubTaskData);
      if (props.updatingSubTask === false) {
        props.setShowSubTaskForm(!props.showSubtaskForm);
      }
    }
  };

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          subtaskTitle: props.subtask ? props.subtask.name : '',
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
            <div className="ph2 pt2">
              <Field<string>
                name="subtaskTitle"
                validate={composeValidators(required, maxValue(100))}
                render={({ input, meta }) => (
                  <div
                    className={` ${checkError(meta) ? 'mb3' : 'mb2'}`}
                  >
                    <InputGroupFieldWithError
                      id="subtaskTitle"
                      value={input.value}
                      onChange={input.onChange}
                      className="ba br2"
                    />
                    {checkError(meta) && (
                      <small className="mv3" style={{ color: 'red' }}>
                        {meta.error || meta.submitError}
                      </small>
                    )}
                  </div>
                )}
              />
              <div className="flex justify-end mt2">
              <Button
                  type="submit"
                  style={{ background: '#3F61C5' }}
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
                    await props.setsubtask({});
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
      state.boardIndexReducer.subTaskReducer.creatingSubTask,
    updatingSubTask:
      state.boardIndexReducer.subTaskReducer.updatingSubTask,
  };
};

export const SubTaskCreator = connect(mapStateToProps, {
  createSubTask,
  updateSubTask,
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
                  background: '#3F61C5',
                  outline: 'none',
                  color: 'white',
                }}
                // loading={submitting}
                type="submit"
                onClick={() => {
                  props.deleteSubTask(props.subTask);
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
                  border: '1px solid #3F61C5',
                  color: '#3F61C5',
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
          className="fr mv3 tigrow-lightBlue pointer mr4"
          style={{ marginTop: 0, color: 'lightsteelblue' }}
          icon="trash"
          onClick={() => setDeletePopover(true)}
        />
      }
    />
  );
};
