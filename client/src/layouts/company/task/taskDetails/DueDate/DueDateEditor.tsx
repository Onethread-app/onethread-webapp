import React from 'react';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { checkError } from 'components/final-form/utils';
import { DateInput } from '@blueprintjs/datetime';
import { Button, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { updateTask } from 'stores/board/Actions';
import { connect } from 'react-redux';
import { ITask } from 'stores/board/Reducer';

interface IDueDateFormProps {
  setDatePopover: (val: boolean) => void;
  updateTask: (task: ITask) => any;
  dueDate: Date;
  updatingTask: boolean;
}

export const DueDateEditorComponent = (props: IDueDateFormProps) => {
  const onSubmit = async (values: any) => {
    const response = await props.updateTask(values);
    if ( response && !props.updatingTask ) {
      await props.setDatePopover(false);
    }
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
                    display: 'inline-block',
                  }}
                >
                  Due Date
                </label>
                <DateInput
                  formatDate={(date: Date) =>
                    date.toLocaleDateString()
                  }
                  placeholder="Select a date"
                  parseDate={(str: string) => new Date(str)}
                  onChange={input.onChange}
                  canClearSelection={false}
                  value={input.value ? new Date(input.value) : null}
                  popoverProps={{
                    targetClassName: 'w-100',
                  }}
                  minDate={
                    new Date() > new Date(props.dueDate)
                      ? new Date(props.dueDate)
                      : new Date()
                  }
                />
                {checkError(meta) && (
                  <small className="mv3" style={{ color: 'red' }}>
                    {meta.error || meta.submitError}
                  </small>
                )}
              </div>
            )}
          />
          <div className="fr">
            <Button
              className="grow pointer white bp3-minimal w4 mt2"
              style={{
                background: '#0FA3A3',
                outline: 'none',
                color: 'white',
              }}
              loading={submitting}
              type="submit"
              disabled={submitting || pristine}
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
