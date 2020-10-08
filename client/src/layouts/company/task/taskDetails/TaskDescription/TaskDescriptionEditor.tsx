import React from 'react';
import { Form, Field } from 'react-final-form';
import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { Button, Icon, EditableText } from '@blueprintjs/core';
import { SubmitError } from 'components/final-form/SubmitError';
import { ITask } from 'stores/board/Reducer';
import { connect } from 'react-redux';
import { updateTask } from 'stores/board/Actions';

interface ITaskDescriptionFormProps {
  description: ITask['description'];
  setEditDescriptionDialog: (val: boolean) => void;
  editDescriptionDialog: boolean;
  updateTask: (task: ITask) => any;
  updatingTask: boolean;
}

export const TaskDescriptionEditorComponent = (
  props: ITaskDescriptionFormProps,
) => {
  const onSubmit = async (values: any) => {
    const response = await props.updateTask(values);
    if ( response && !props.updatingTask ) {
      props.setEditDescriptionDialog(false);
      return true;
    }
    return { [response.fieldName]: response.message };
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
          <form onSubmit={handleSubmit}>
            <div className="pr2">
              <SubmitError errorMessage={submitError} />
            </div>
            <div className="pr2 pt2">
              <Field<string>
                name="description"
                validate={composeValidators(required, maxValue(5000))}
                render={({ input, meta }) => (
                  <div>
                    <EditableText
                      multiline={true}
                      minLines={3}
                      maxLines={5}
                      value={input.value}
                      onChange={input.onChange}
                      className="outline"
                      placeholder=""
                    />
                    {checkError(meta) && (
                      <p className="mv2" style={{ color: 'red' }}>
                        {meta.error || meta.submitError}
                      </p>
                    )}
                  </div>
                )}
              />
              <div className="flex justify-end mt2">
                <Button
                  className="mr2"
                  style={{ background: 'transparent' }}
                  icon="cross"
                  onClick={() =>
                    props.setEditDescriptionDialog(
                      !props.editDescriptionDialog,
                    )
                  }
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
    description:
      state.boardIndexReducer.boardReducer.currentTask.description,
    updatingTask: state.boardIndexReducer.boardReducer.updatingTask,
  };
};

export const TaskDescriptionEditor = connect(mapStateToProps, {
  updateTask,
})(TaskDescriptionEditorComponent);
