import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Form, Field } from 'react-final-form';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { EditableText } from '@blueprintjs/core/lib/esm/components/editable-text/editableText';

import { ITask } from 'stores/task/Reducer';
import { updateTask } from 'stores/task/Actions';

import {
  required,
  checkError,
  maxValue,
  composeValidators,
} from 'components/final-form/utils';
import { SubmitError } from 'components/final-form/SubmitError';

interface ITaskTitleFormProps {
  setNameEdit: (val: boolean) => void;
  nameEdit: boolean;
  currentTask: ITask;
  updateTask: (task) => any;
  updatingTask: boolean;
  errorOnUpdatingTask: string;
}

const TaskTitleEditorComponent = (props: ITaskTitleFormProps) => {
  const onSubmit = async (values: any) => {
    props.updateTask({
      taskId: props.currentTask._id,
      projectId: props.currentTask.project._id,
      companyId: props.currentTask.company._id,
      parentTask: 'null',
      name: values.name,
    });
    props.setNameEdit(false);
  };

  useEffect(() => {
    if (!props.nameEdit) {
      if (
        props.updatingTask === false &&
        props.errorOnUpdatingTask === ''
      ) {
        props.setNameEdit(false);
      }
    }
  }, [props.updatingTask]);

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
                validate={composeValidators(required, maxValue(150))}
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
    updatingTask: state.taskIndexReducer.taskReducer.updatingTask,
    errorOnUpdatingTask:
      state.taskIndexReducer.taskReducer.errorOnUpdatingTask,
  };
};

export const TaskTitleEditor = connect(mapStateToProps, {
  updateTask,
})(TaskTitleEditorComponent);
