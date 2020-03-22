import React from 'react';
import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { Button } from '@blueprintjs/core';

const PrefacePageComponent = (props: any) => {
  const [disabled] = React.useState(false);

  return (
    <div className='bl b--black-05 bw1 pl5 ml5 h5'>
      <p>project preface</p>
      <Form
        onSubmit={props.onSubmit}
        initialValues={{ optionalRole: props.optionalRole }}
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
          <form className='fl w-100' onSubmit={handleSubmit}>
            <div className='mb3'>
              <SubmitError errorMessage={submitError} />
            </div>
            <p className='b f5 mb3'>Admins</p>
            <div className='mb3'>
              <Field<string>
                name='optionalRole'
                type='checkbox'
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name='optionalRole'
                      className='mr2'
                      component='input'
                      type='checkbox'
                      value='updateProjectPreface'
                      disabled={disabled}
                    />
                    Update info's in Project Preface
                  </label>
                )}
              />
              <Field<string>
                name='optionalRole'
                type='checkbox'
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name='optionalRole'
                      className='mr2'
                      component='input'
                      type='checkbox'
                      value='addFileProject'
                      disabled={disabled}
                    />
                    Add files in Project Preface
                  </label>
                )}
              />
            </div>
            {disabled === false ? (
              <div>
                <Button
                  className='w4 grow h2 pointer'
                  style={{
                    background: '#0fa3a3',
                    outline: 'none',
                    color: 'white'
                  }}
                  loading={submitting}
                  type='submit'
                  disabled={submitting || pristine}
                >
                  Save
                </Button>
              </div>
            ) : (
              undefined
            )}
          </form>
        )}
      />
    </div>
  );
};

export const PrefacePage = connect(null, null)(PrefacePageComponent);
