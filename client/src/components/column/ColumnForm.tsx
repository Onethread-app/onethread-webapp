import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { Form, Field } from 'react-final-form';

import {
  createTaskStatus,
  updateTaskStatus,
} from 'stores/task/Actions';

import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import {
  TextInput,
  StyledButton,
  SimpleButton,
} from 'components/home/task-section/TaskSection.styles';
import { ITaskStatus } from 'stores/task/Reducer';
import { IProject } from 'stores/project/Reducer';

interface ColumnFormProps {
  setShowColumnFormDialog: (val: boolean) => void;
  status?: ITaskStatus;
}

interface ColumnFormInternalProps extends ColumnFormProps {
  project: IProject;
  createTaskStatus: (statusInfo: any) => void;
  updateTaskStatus: (statusInfo: any) => void;
}

const ColumnFormComponent = (props: ColumnFormInternalProps) => {
  const onSubmit = async (values: any) => {
    const statusInfo = {
      ...values,
      _id: props.status ? props.status._id : undefined,
      positionInBoard: Number(values.positionInBoard),
      projectId: props.project._id,
      companyId: props.project.company._id,
    };
    if (props.status && isEmpty(props.status.name) === false) {
      // edit column name
      props.updateTaskStatus(statusInfo);
    } else {
      // New column create
      props.createTaskStatus(statusInfo);
    }
    if (props.setShowColumnFormDialog) {
      props.setShowColumnFormDialog(false);
    }
    return {};
  };

  return (
    <div className="pa3">
      <div>
        {props.status ? <h3>Edit Status</h3> : <h3>Create Status</h3>}
      </div>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          name: props.status ? props.status.name : undefined,
          positionInBoard: props.status?.positionInBoard,
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
            <div className="pv3 justify-content w-100">
              <Field<string>
                name="name"
                validate={composeValidators(required, maxValue(60))}
                render={({ input, meta }) => (
                  <div className={`flex items-center`}>
                    <label className="text-width">Name</label>
                    <TextInput
                      id="name"
                      value={input.value}
                      onChange={input.onChange}
                      style={{ border: '1px solid #b1b1b1' }}
                      hasError={
                        checkError(meta) &&
                        (meta.error || meta.submitError)
                      }
                    />
                  </div>
                )}
              />
              <Field<string>
                name="positionInBoard"
                validate={composeValidators(required, maxValue(5))}
                parse={(value) => value.replaceAll(/[^0-9]/g, '')}
                placeholder="Position in board"
                render={({ input, meta }) => (
                  <div className={`flex items-center `}>
                    <label className="text-width">Position</label>
                    <TextInput
                      {...input}
                      value={input.value}
                      onChange={input.onChange}
                      style={{ border: '1px solid #b1b1b1' }}
                      hasError={
                        checkError(meta) &&
                        (meta.error || meta.submitError)
                      }
                    />
                  </div>
                )}
              />
              <div className="flex justify-between items-center mt3">
                <StyledButton
                  type="submit"
                  disabled={
                    submitting || pristine || hasValidationErrors
                  }
                >
                  {props.status ? 'Update' : 'Create'}
                </StyledButton>
                <SimpleButton
                  onClick={(e: any) => {
                    if (props.setShowColumnFormDialog) {
                      props.setShowColumnFormDialog(false);
                    }
                  }}
                >
                  Cancel
                </SimpleButton>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  project: state.projectReducer.projectDetails,
});

export const ColumnForm = connect(mapStateToProps, {
  createTaskStatus,
  updateTaskStatus,
})(ColumnFormComponent);
