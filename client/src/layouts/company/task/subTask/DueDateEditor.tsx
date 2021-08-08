import React from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { checkError } from 'components/final-form/utils';
// import { DateInput } from '@blueprintjs/datetime';
import { Button, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
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
  setDueDatePopover: React.Dispatch<
    React.SetStateAction<{
      _id: string;
      open: boolean;
    }>
  >;
  updateSubTask: (subTask: ISubTask) => void;
  subTask: ISubTask;
  dueDate: Date | undefined;
  updatingSubTask: boolean;
  errorOnUpdate: string;
}

const DueDateEditor = (props: IDueDateFormProps) => {
  const [loading, setLoading] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  const handleInputChange = (e) => {
    if (e <= new Date()) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const onSubmit = (values: any) => {
    setLoading(true);
    props.updateSubTask({
      _id: props.subTask._id,
      dueDate: values.dueDate,
    });
  };

  React.useEffect(() => {
    if (
      loading === true &&
      props.updatingSubTask === false &&
      props.errorOnUpdate === ''
    ) {
      props.setDueDatePopover({ _id: '', open: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, props.updatingSubTask, props.errorOnUpdate]);

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
        <form className="fl w-100 ph2 pt2" onSubmit={handleSubmit}>
          <div className="flex justify-end">
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
          </div>
          <Field<string>
            name="dueDate"
            render={({ input, meta }) => (
              <div className={`${checkError(meta) ? 'mb3' : 'mb2'}`}>
                <label
                  style={{
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  {/* Due Date */}
                  {t('app.project.Project-boards.Due-Date')}
                </label>
                {/* <DateInput
                  formatDate={(date: Date) =>
                    date.toLocaleDateString()
                  }
                  placeholder="Select a date"
                  parseDate={(str: string) => new Date(str)}
                  onChange={(e) => {
                    input.onChange(e);
                    handleInputChange(e);
                  }}
                  canClearSelection={false}
                  value={input.value ? new Date(input.value) : null}
                  popoverProps={{
                    targetClassName: 'w-100',
                  }}
                  minDate={new Date()}
                /> */}
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    value={input.value ? new Date(input.value) : null}
                    onChange={(e) => {
                      input.onChange(e);
                      handleInputChange(e);
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    minDate={new Date()}
                    className="due-date-input"
                    placeholder={t('app.project.Project-boards.Select-date')}
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
          <div className="fr">
            <Button
              className="grow pointer white bp3-minimal w4 mt2"
              style={{
                background: '#3F61C5',
                outline: 'none',
                color: 'white',
              }}
              loading={submitting}
              type="submit"
              disabled={submitting || pristine || disable}
            >
              Submit
            </Button>
          </div>
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
