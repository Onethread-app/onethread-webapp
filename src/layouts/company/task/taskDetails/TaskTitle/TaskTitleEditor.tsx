import React from 'react';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { required, checkError } from 'components/final-form/utils';
import { EditableText, Button, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ITask } from 'stores/board/Reducer';

interface ITaskTitleFormProps {
  setNameEdit: (val: boolean) => void;
  nameEdit: boolean;
  currentTask?: ITask;
}

 const TaskTitleEditorComponent = (props: ITaskTitleFormProps) => {
  const onSubmit = async (values: any) => {
    props.setNameEdit(false);
  }
  return (
    <div>
      <Form
        onSubmit={onSubmit}
        initialValues={{description: props.currentTask!.name}}
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
              <div className="ph2 pt2 w-100">
                <Field<string>
                  name="description"
                  validate={required}
                  render={({ input, meta }) =>
                    <div className={`${checkError(meta) ? 'mb3' : 'mb2'}`}>
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
                    onClick={() => props.setNameEdit(!props.nameEdit)}
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
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
  };
};

export const TaskTitleEditor = connect(mapStateToProps, null)(TaskTitleEditorComponent)