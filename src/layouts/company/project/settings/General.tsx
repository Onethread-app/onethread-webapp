import React from 'react';
import { connect } from 'react-redux';
// import { isEqual } from 'lodash';
// import { Form, Field } from 'react-final-form';
// import { SubmitError } from 'components/final-form/SubmitError';
// import { Button } from '@blueprintjs/core';

const GeneralPageComponent = (props: any) => {
  const [archiveProjectCheck] = React.useState(false);
  // const [disabled] = React.useState(
  //   isEqual(props.companyRole, 'superAdmin') === false
  // );
  return (
    <div className='bl b--black-05 bw1 pl5 ml5 h5'>
      {console.log(archiveProjectCheck)}
      <p>general</p>
      {/* <Form
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
                      value='cRUDAnnoucment'
                      disabled={disabled}
                    />
                    Create/Update/Delete Company Announcement
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
                      value='editProfile'
                      disabled={disabled}
                    />
                    Edit Basic/Advanced Information of Profile
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
                      value='archiveProject'
                      disabled={disabled}
                    />
                    Archive Projects
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
                      value='addRemoveModerator'
                      disabled={disabled}
                    />
                    Add/Delete Project Moderator
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
                      value='messageAssociate'
                      disabled={disabled}
                    />
                    Message Associates
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
                      value='addAcceptRejectAssociate'
                      disabled={disabled}
                    />
                    Add/Accept/Reject Requests from Companies to be Associates
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
                      value='acceptRejectProjectFromAssociate'
                      disabled={disabled}
                    />
                    Accept/Reject Project Request from Associates
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
      /> */}
    </div>
  );
};
export const GeneralPage = connect(null, null)(GeneralPageComponent);
