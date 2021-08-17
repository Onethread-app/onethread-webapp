import React from 'react';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { checkError } from 'components/final-form/utils';
import { Button, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
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
  setDatePopover: (val: boolean) => void;
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
    const response = await props.updateTask(values);
    if (response && !props.updatingTask) {
      await props.setDatePopover(false);
    }
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
        <form className="fl w-100 ph2 pt2" onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <Icon
              icon={IconNames.CROSS}
              iconSize={20}
              className="grow pointer"
              onClick={(e: any) => props.setDatePopover(false)}
            />
          </div>
          <div>
            <SubmitError errorMessage={submitError} />
          </div>
          <Field<string>
            name="dueDate"
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb2'}`}>
                <label
                  style={{
                    marginBottom: '5px',
                    display: 'block',
                  }}
                >
                  {t('app.project.Project-boards.Due-Date')}
                  {/* Due Date */}
                </label>
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
                    className="due-date-input"
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    placeholder={t(
                      'app.project.Project-boards.Select-date',
                    )}
                    minDate={new Date()}
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
                background: '#34b3e9',
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

const mapStateToProps = (state: any) => {
  return {
    dueDate: state.boardIndexReducer.boardReducer.currentTask.dueDate,
    updatingTask: state.boardIndexReducer.boardReducer.updatingTask,
  };
};

export const DueDateEditor = connect(mapStateToProps, { updateTask })(
  DueDateEditorComponent,
);
