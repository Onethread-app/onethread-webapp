import React from 'react';
import { Form, Field } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';
import { Button, Icon, EditableText } from '@blueprintjs/core';
import { SubmitError } from 'components/final-form/SubmitError';
import { ITask } from 'stores/board/Reducer';
import { connect } from 'react-redux';
import { updateTask } from 'stores/board/Actions';

interface ITaskDescriptionFormProps {
  description: ITask['description'];
  setEditDescriptionDialog: (val: boolean) => void;
  editDescriptionDialog: boolean;
  updateTask: (task: ITask) => void;
}

export const TaskDescriptionEditorComponent = (props: ITaskDescriptionFormProps) => {
  const onSubmit = async (values: any) => {
    await props.updateTask(values);
    props.setEditDescriptionDialog(false);
  };
  return (
    <div>
      <Form
        onSubmit={onSubmit}
        initialValues={{ description: props.description }}
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
                  name="description"
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
                    onClick={() => props.setEditDescriptionDialog(!props.editDescriptionDialog)}
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

const mapStateToProps = (state: any) => {
  return {
    description: state.boardIndexReducer.boardReducer.currentTask.description,
  };
};

export const TaskDescriptionEditor = connect(mapStateToProps, { updateTask })(TaskDescriptionEditorComponent);
