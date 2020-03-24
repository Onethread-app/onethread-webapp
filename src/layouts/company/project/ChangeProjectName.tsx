import { Divider, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import React from 'react';
import { Form, Field } from 'react-final-form';
import {
  checkError,
  maxValue,
  composeValidators,
  required
} from 'components/final-form/utils';
import { SubmitError } from 'components/final-form/SubmitError';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import { updateProjectName } from '../../../stores/project/Actions';

interface ChangeNameProps {
  setShowDialog: (val: boolean) => void;
  projectId: string;
}

interface ChangeNameInternalProps extends ChangeNameProps {
  updateProjectName: (name: string, projectId: string) => Promise<number>;
}

const ChangeNameComponent = (props: ChangeNameInternalProps) => {
  const onSubmit = async (values: any) => {
    const responseStatus = await props.updateProjectName(
      values.name,
      props.projectId
    );
    if (responseStatus === 200) {
      props.setShowDialog(false);
      return true;
    }
    return {};
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        name: ''
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
        <form className='fl w-100 ph4 pt6' onSubmit={handleSubmit}>
          <SubmitError errorMessage={submitError} />
          <Field<string>
            name='name'
            validate={composeValidators(required, maxValue(32))}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
                <InputGroupFieldWithLabel
                  id='name'
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: 'none',
                    fontSize: '18px'
                  }}
                  error={checkError(meta) && (meta.error || meta.submitError)}
                  label='Project Name*'
                />
              </div>
            )}
          />
          <Divider />
          <div className='flex justify-end'>
            <Button
              className='w4 grow h2 pointer mr3'
              style={{
                background: '#fff',
                outline: 'none',
                border: '1px solid #0fa3a3',
                color: '#0fa3a3'
              }}
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
            >
              cancel
            </Button>
            <Button
              className='w4 grow h2 pointer'
              style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
              loading={submitting}
              type='submit'
              disabled={submitting || pristine}
            >
              Save
            </Button>
          </div>
        </form>
      )}
    />
  );
};

export const ChangeName = connect(null, { updateProjectName })(
  ChangeNameComponent
);
