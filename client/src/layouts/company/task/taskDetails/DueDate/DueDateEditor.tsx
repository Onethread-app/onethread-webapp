import React from 'react';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { checkError } from 'components/final-form/utils';
import { updateTask } from 'stores/board/Actions';
import { connect } from 'react-redux';
import { ITask } from 'stores/board/Reducer';
import { useTranslation } from 'react-i18next';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import '../../task.scss';

interface IDueDateFormProps {
  updateTask: (task: ITask) => any;
  dueDate: Date;
  updatingTask: boolean;
}

export const DueDateEditorComponent = (props: IDueDateFormProps) => {
  const [disable, setDisable] = React.useState(false);

  const handleInputChange = (e) => {
    if (e <= new Date()) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const onSubmit = async (values: any) => {
    await props.updateTask(values);
  };

  const { t } = useTranslation();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        dueDate: props.dueDate ? new Date(props.dueDate) : null,
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
        <form className="w-100" onSubmit={handleSubmit}>
          <div>
            <SubmitError errorMessage={submitError} />
          </div>
          <Field<string>
            name="dueDate"
            render={({ input, meta }) => (
              <div className="task-info-items">
                <h1 className="f6">
                  {t('app.project.Project-boards.Due-Date')}:
                </h1>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    value={input.value ? new Date(input.value) : null}
                    onChange={(e) => {
                      input.onChange(e);
                      handleInputChange(e);
                    }}
                    className="task-due-date"
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    placeholder={t(
                      'app.project.Project-boards.Select-date',
                    )}
                    minDate={new Date()}
                    onClose={handleSubmit}
                  />
                </MuiPickersUtilsProvider>

                {checkError(meta) && (
                  <small className="mv3" style={{ color: 'red' }}>
                    {meta.error || meta.submitError}
                  </small>
                )}
              </div>
            )}
          />
          {disable && (
            <p style={{ color: 'red' }}>
              {t('app.project.Project-boards.Due-date-text')}
            </p>
          )}
        </form>
      )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    dueDate: state.boardIndexReducer.boardReducer.currentTask.dueDate,
    updatingTask: state.boardIndexReducer.boardReducer.updatingTask,
  };
};

export const DueDateEditor = connect(mapStateToProps, { updateTask })(
  DueDateEditorComponent,
);
