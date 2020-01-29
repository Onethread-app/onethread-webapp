import React, { useState } from 'react';
import { Button, EditableText, Icon, Popover } from '@blueprintjs/core';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { required, checkError } from 'components/final-form/utils';
import { createSubTask } from 'stores/subtask/Actions';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ISubTask } from 'stores/subtask/Reducer';

interface ITaskDescriptionCreateFormProps {
  setShowSubTaskForm: (val: boolean) => void;
  showSubtaskForm: boolean;
  createSubTask: (subTask: ISubTask) => void;

}
interface ISubTaskDescriptionDeleteFormProps {
  subTask: ISubTask;
  deleteSubTask: (subTask: ISubTask) => void;
}

export const SubTaskCreatorComponent = (props: ITaskDescriptionCreateFormProps & RouteComponentProps) => {

  const onSubmit = async (values: any) => {

    const subTaskData = {
      name: values.subtaskTitle
    };

    await props.createSubTask(subTaskData);
    props.setShowSubTaskForm(false);
  }

  return (
    <div>
      <Form
        onSubmit={onSubmit}
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
            <form
              onSubmit={handleSubmit}
            >
              <SubmitError errorMessage={submitError} />
              <div className="ph2 pt2">
                <Field<string>
                  name="subtaskTitle"
                  validate={required}
                  render={({ input, meta }) =>
                    <div className={` ${checkError(meta) ? 'mb3' : 'mb2'}`}>
                      <EditableText
                        multiline={true}
                        minLines={3}
                        maxLines={20}
                        value={input.value}
                        onChange={input.onChange}
                        className="outline"
                        placeholder=""
                      />
                      {checkError(meta) &&
                        <small className="mv3" style={{ color: 'red' }}>
                          {meta.error || meta.submitError}
                        </small>}
                    </div>
                  }
                />
                <div className="flex justify-end mt2">
                  <Button
                    className="mr2"
                    type="submit"
                    style={{ background: 'transparent' }}
                    icon="cross"
                    onClick={() => props.setShowSubTaskForm(!props.showSubtaskForm)}
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

export const SubTaskCreator = connect(null, { createSubTask })(withRouter(SubTaskCreatorComponent));

export const SubTaskDelete = (props: ISubTaskDescriptionDeleteFormProps) => {

  const [deletePopover, setDeletePopover] = useState(false);
  return (
    <Popover
      isOpen={deletePopover}
      content={
        <div className="pa3 cf bg-white" style={{ width: '350px' }}>
          <h1 className="f5">Delete</h1>
          <div>
            <p>Are you sure want to permanently remove X from Y? </p>
            <div className="flex justify-end mt4">
              <Button
                className="grow h2 pointer white bp3-minimal w4 mr3"
                style={{
                  background: '#fff',
                  outline: 'none',
                  border: '1px solid #0fa3a3',
                  color: '#0fa3a3'
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
                  color: 'white'
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
          style={{ marginTop: 0 }}
          icon="trash"
          onClick={() => setDeletePopover(true)}
        />
      }
    />
  );
};
