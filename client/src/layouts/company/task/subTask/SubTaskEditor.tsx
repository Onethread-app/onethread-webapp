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
import {
  createSubTask,
  updateSubTaskTitile,
} from 'stores/subtask/Actions';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ISubTask } from 'stores/subtask/Reducer';
import { isEmpty } from 'lodash';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';

interface ITaskDescriptionCreateFormProps {
  setShowSubTaskForm: (val: boolean) => void;
  showSubtaskForm: boolean;
  createSubTask: (subTask: ISubTask) => Promise<any>;
  subtask?: ISubTask;
  setsubtask: (subTask: ISubTask) => void;
  updateSubTaskTitile: (subTask: ISubTask) => Promise<any>;
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
      const response = await props.createSubTask(subTaskData);
      if (response.message === 200) {
        values.subtaskTitle = '';
        return true;
      }
      return { [response.fieldName]: response.message };
    } else {
      const updateSubTaskData = {
        _id: props.subtask!._id,
        name: values.subtaskTitle,
      };
      const response = await props.updateSubTaskTitile(
        updateSubTaskData,
      );
      if (response.message === 200) {
        values.subtaskTitle = '';
        return true;
      }
      return { [response.fieldName]: response.message };
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
                validate={composeValidators(required, maxValue(60))}
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
                  className="mr2"
                  style={{ background: 'transparent' }}
                  icon="cross"
                  onClick={async () => {
                    await props.setsubtask({});
                    props.setShowSubTaskForm(!props.showSubtaskForm);
                  }}
                />
                <Button
                  type="submit"
                  style={{ background: '#0FA3A3' }}
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
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export const SubTaskCreator = connect(null, {
  createSubTask,
  updateSubTaskTitile,
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
                  background: '#fff',
                  outline: 'none',
                  border: '1px solid #0fa3a3',
                  color: '#0fa3a3',
                }}
                onClick={() => setDeletePopover(false)}
              >
                Cancel
              </Button>
              <Button
                className="grow h2 pointer white bp3-minimal w4"
                style={{
                  background: '#0fa3a3',
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
                Remove
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
