import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import moment from 'moment';

import { Form, Field } from 'react-final-form';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers/MuiPickersUtilsProvider';
import { KeyboardDateTimePicker } from '@material-ui/pickers/DateTimePicker/DateTimePicker';

import { ITask } from 'stores/task/Reducer';
import { updateTask } from 'stores/task/Actions';

import { SubmitError } from 'components/final-form/SubmitError';
import { checkError } from 'components/final-form/utils';

import '../../task.scss';

interface IDueDateFormProps {
  updateTask: (task: ITask) => any;
  dueDate: Date;
  updatingTask: boolean;
}

export const DueDateEditorComponent = (props: IDueDateFormProps) => {
  const { t } = useTranslation();

  const onSubmit = async (values: any) => {
    await props.updateTask(values);
  };

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
        <form className='w-100' onSubmit={handleSubmit}>
          <div>
            <SubmitError errorMessage={submitError} />
          </div>
          <Field<string>
            name='dueDate'
            render={({ input, meta }) => (
              <div className='task-info-items'>
                <h1 className='f6'>
                  {t('app.project.Project-boards.Due-Date')}
                  :
                </h1>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    ampm
                    margin='normal'
                    id='date-picker-dialog'
                    format='MM/dd/yyyy'
                    value={input.value ? new Date(input.value) : null}
                    onChange={input.onChange}
                    className='task-due-date'
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    placeholder={t(
                      'app.project.Project-boards.Select-date',
                    )}
                    minDate={new Date()}
                    maxDate={moment().add(10, 'y').toDate()}
                    onClose={handleSubmit}
                  />
                </MuiPickersUtilsProvider>

                {checkError(meta) && (
                  <small className='mv3' style={{ color: 'red' }}>
                    {meta.error || meta.submitError}
                  </small>
                )}
              </div>
            )}
          />
        </form>
      )}
    />
  );
};

const mapStateToProps = (state: any) => ({
  dueDate: state.taskIndexReducer.taskReducer.currentTask.dueDate,
  updatingTask: state.taskIndexReducer.taskReducer.updatingTask,
});

export const DueDateEditor = connect(mapStateToProps, { updateTask })(
  DueDateEditorComponent,
);
