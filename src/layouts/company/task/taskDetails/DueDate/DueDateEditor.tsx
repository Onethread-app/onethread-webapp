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
  updateTask: (task: ITask) => void;
}

export const DueDateEditorComponent = (props: IDueDateFormProps) => {

  const onSubmit = async (values: any) => {
    await props.updateTask(values);
    await props.setDatePopover(false);
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
        <form
          className="fl w-100 ph2 pt2"
          onSubmit={handleSubmit}
        >
          <SubmitError errorMessage={submitError} />
          <div className="flex justify-end">
            <Icon
              icon={IconNames.CROSS}
              iconSize={20}
              className="grow pointer"
              onClick={(e: any) => props.setDatePopover(false)}
            />
          </div>
          <Field<string>
            name="dueDate"
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb2'}`}>
                <label>Due  Date</label>
                <DateInput
                  formatDate={(date: Date) => date.toLocaleDateString()}
                  parseDate={(str: string) => new Date(str)}
                  onChange={input.onChange}
                  canClearSelection={false}
                  value={input.value ? input.value : null}
                  popoverProps={{
                    targetClassName: 'w-100'
                  }}
                  minDate={new Date()}
                // maxDate={maxBirthDate()}
                />
                {checkError(meta) &&
                  <small className="mv3" style={{ color: 'red' }}>
                    {meta.error || meta.submitError}
                  </small>}
              </div>
            }
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

export const DueDateEditor = connect(null, { updateTask })(DueDateEditorComponent);
