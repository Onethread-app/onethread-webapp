import React from 'react';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import {
  required,
  checkError,
  maxValue,
  composeValidators,
} from 'components/final-form/utils';
import { EditableText, Button, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ITask } from 'stores/board/Reducer';
import { updateTask } from 'stores/board/Actions';

interface ITaskTitleFormProps {
  setNameEdit: (val: boolean) => void;
  nameEdit: boolean;
  currentTask?: ITask;
  updateTask: (task: ITask) => any;
  updatingTask: boolean;
}

const TaskTitleEditorComponent = (props: ITaskTitleFormProps) => {
  const onSubmit = async (values: any) => {
    const response = await props.updateTask(values);
    if ( response && !props.updatingTask ) {
      props.setNameEdit(false);
    }
  };

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        initialValues={{ name: props.currentTask!.name }}
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
            <div className="ph2">
              <SubmitError errorMessage={submitError} />
            </div>
            <div className="ph2 pt2 w-100">
              <Field<string>
                name="name"
                validate={composeValidators(required, maxValue(60))}
                render={({ input, meta }) => (
                  <div
                    className={`${checkError(meta) ? 'mb3' : 'mb2'}`}
                  >
                    <EditableText
                      multiline={true}
                      minLines={3}
                      maxLines={10}
                      value={input.value}
                      onChange={input.onChange}
                      className="outline pa1"
                      placeholder=""
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
                  onClick={() => props.setNameEdit(!props.nameEdit)}
                />
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
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
    updatingTask: state.boardIndexReducer.boardReducer.updatingTask,
  };
};

export const TaskTitleEditor = connect(mapStateToProps, {
  updateTask,
})(TaskTitleEditorComponent);
