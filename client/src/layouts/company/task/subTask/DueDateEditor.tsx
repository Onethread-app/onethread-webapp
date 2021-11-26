import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker } from '@material-ui/pickers/DatePicker/DatePicker';
import { MuiPickersUtilsProvider } from '@material-ui/pickers/MuiPickersUtilsProvider';

import { checkError } from 'components/final-form/utils';

import '../task.scss';
import { ITask } from 'stores/task/Reducer';
import { updateTask } from 'stores/task/Actions';

interface IDueDateFormProps {
  updateTask: (subTask) => void;
  subTask: ITask;
  dueDate: Date | undefined;
  updatingSubTask: boolean;
  errorOnUpdate: string;
}

const DueDateEditor = (props: IDueDateFormProps) => {
  const { t } = useTranslation();

  const onSubmit = (values: any) => {
    props.updateTask({
      taskId: props.subTask._id,
      dueDate: values.dueDate,
      projectId: props.subTask.project._id,
      companyId: props.subTask.company._id,
      parentTask: props.subTask.parentTask,
    });
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
        <form className="mh1" onSubmit={handleSubmit}>
          <Field<string>
            name="dueDate"
            render={({ input, meta }) => (
              <>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    value={input.value ? new Date(input.value) : null}
                    onChange={input.onChange}
                    className="due-date-input due-date-subtask"
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
              </>
            )}
          />
        </form>
      )}
    />
  );
};

const mapStateToProps = (state: any) => ({
  updatingSubTask:
    state.taskIndexReducer.subTaskReducer.updatingSubTask,
  errorOnUpdate: state.taskIndexReducer.subTaskReducer.errorOnUpdate,
});

export default connect(mapStateToProps, {
  updateTask,
})(DueDateEditor);
