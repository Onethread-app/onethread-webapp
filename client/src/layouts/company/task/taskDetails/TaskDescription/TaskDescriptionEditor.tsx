import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { EditableText } from '@blueprintjs/core/lib/esm/components/editable-text/editableText';

import { ITask } from 'stores/task/Reducer';
import { updateTask } from 'stores/task/Actions';

import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { SubmitError } from 'components/final-form/SubmitError';

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
    if (response && !props.updatingTask) {
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
                  type="submit"
                  style={{ background: '#34b3e9' }}
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
                  style={{ background: 'transparent' }}
                  icon="cross"
                  onClick={() =>
                    props.setEditDescriptionDialog(
                      !props.editDescriptionDialog,
                    )
                  }
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
      state.taskIndexReducer.taskReducer.currentTask.description,
    updatingTask: state.taskIndexReducer.taskReducer.updatingTask,
  };
};

export const TaskDescriptionEditor = connect(mapStateToProps, {
  updateTask,
})(TaskDescriptionEditorComponent);
