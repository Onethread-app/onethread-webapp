import React from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
// import { SubmitError } from 'components/final-form/SubmitError';
import { checkError } from 'components/final-form/utils';
// import { Icon } from '@blueprintjs/core';
// import { IconNames } from '@blueprintjs/icons';
import { updateSubTask } from 'stores/subtask/Actions';
import { ISubTask } from 'stores/subtask/Reducer';
import { useTranslation } from 'react-i18next';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import '../task.scss';

interface IDueDateFormProps {
  updateSubTask: (subTask: ISubTask) => void;
  subTask: ISubTask;
  dueDate: Date | undefined;
  updatingSubTask: boolean;
  errorOnUpdate: string;
}

const DueDateEditor = (props: IDueDateFormProps) => {
  // const [loading, setLoading] = React.useState(false);

  const onSubmit = (values: any) => {
    props.updateSubTask({
      _id: props.subTask._id,
      dueDate: values.dueDate,
    });
  };

  // React.useEffect(() => {
  //   if (
  //     loading === true &&
  //     props.updatingSubTask === false &&
  //     props.errorOnUpdate === ''
  //   ) {
  //     props.setDueDatePopover({ _id: '', open: false });
  //   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loading, props.updatingSubTask, props.errorOnUpdate]);

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
        <form className="mh1" onSubmit={handleSubmit}>
          {/* <div className="flex justify-end">
            <Icon
              icon={IconNames.CROSS}
              iconSize={20}
              className="grow pointer"
              onClick={(e: any) =>
                props.setDueDatePopover({ _id: '', open: false })
              }
            />
          </div>
          <div>
            <SubmitError errorMessage={submitError} />
          </div> */}
          <Field<string>
            name="dueDate"
            render={({ input, meta }) => (
              <>
                {/* <label
                  style={{
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  Due Date
                  {t('app.project.Project-boards.Due-Date')}
                </label> */}

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
    state.boardIndexReducer.subTaskReducer.updatingSubTask,
  errorOnUpdate: state.boardIndexReducer.subTaskReducer.errorOnUpdate,
});

export default connect(mapStateToProps, {
  updateSubTask,
})(DueDateEditor);
