import React from 'react';
import { required, composeValidators, isEmail } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { checkError } from 'components/final-form/utils';
import { Form, Field } from 'react-final-form';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button } from '@blueprintjs/core';
import { isEqual } from 'lodash';
import { tigrowApi } from 'config';

const EmailVerificationFormComponent = ((props: RouteComponentProps) => {

  const onSubmit = async (values: { email: string }) => {
    try {
      const response = await tigrowApi.post('/utils/email-checker', values);
      if (response.status === 200) {
          props.history.push('/signup?email=' + values.email);
        }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
        console.log('Network error');
      } else if (error.response.status === 409) {
        props.history.push('/signin?email=' + values.email);
      } else {
        // tslint:disable-next-line: no-console
        console.log(error.response);
      }
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine }) => (
        <form className="flex-ns" onSubmit={handleSubmit}>
          <div className="flex-ns flex-column-ns flex-auto-ns w-90-ns mr3-ns w-100 mv3 mv0-ns">
            <Field<string>
              name="email"
              validate={composeValidators(required, isEmail)}
              render={({ input, meta }) =>
                <InputGroupFieldWithError
                  id={input.name}
                  placeHolder="Enter your mail address"
                  value={input.value}
                  onChange={input.onChange}
                  style={{ boxShadow: 'none', borderRadius: '25px', height: '46px', paddingLeft: '30px' }}
                  error={checkError(meta) && (meta.error || meta.submitError)}
                />
              }
            />
          </div>
          <Button
            className="grow h2 pointer white bp3-minimal w5-ns w-100 ba"
            style={{
              background: 'transparent',
              // outline: 'none',
              color: 'white',
              borderColor: 'white',
              borderWidth: '1px',
              borderRadius: '25px',
              height: '46px'
            }}
            loading={submitting}
            type="submit"
            disabled={submitting || pristine}
          >
            Join
		        </Button>
        </form>
      )}
    />
  );
});
export const EmailVerificationForm = withRouter(EmailVerificationFormComponent);