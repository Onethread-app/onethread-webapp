import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tigrowApi } from 'config';

import { AxiosRequestConfig } from 'axios';
import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import forgotPass from './../../resources/images/forgotPassword.png';

import {
  composeValidators,
  required,
  isEmail,
  checkError,
} from 'components/final-form/utils';
import { SubmitError } from 'components/final-form/SubmitError';
import { errorMessgeHandler } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';

interface ForgotPasswordProps {
  setEmailComponentView: (val: boolean) => void;
}

const ForgotPasswordComponnet = (props: ForgotPasswordProps) => {
  const onSubmit = async (values: { email: string }) => {
    try {
      const response = await tigrowApi.post(
        'accounts/forget-password',
        values,
        {
          'Content-Type': 'application/json',
        } as AxiosRequestConfig,
      );
      if (response.status === 200) {
        props.setEmailComponentView(true);
      }
      return true;
    } catch (error) {
      const err = errorMessgeHandler(error);
      return { [err.fieldName]: err.message };
    }
  };

  return (
    <div className="dt cf w-100 vh-100">
      <div className="v-mid dtc ph4">
        <div className="center w-15-ns w-34">
          <img src={forgotPass}></img>
        </div>
        <h1 className="f3 tc">Forgot your Password ?</h1>
        <h1 className="f5 fw3 tc">
          Don't worry ! Resetting your password is super easy.
        </h1>
        <h1 className="f5 fw3 tc">Enter your mail address</h1>
        <Form
          onSubmit={onSubmit}
          render={({
            handleSubmit,
            submitting,
            pristine,
            submitError,
          }) => (
            <form
              className="w-25-l w-50-m center mt4-ns"
              onSubmit={handleSubmit}
            >
              <SubmitError errorMessage={submitError} />
              <h1 className="f4 lh-copy">Email</h1>
              <Field<string>
                name="email"
                validate={composeValidators(required, isEmail)}
                render={({ input, meta }) => (
                  <InputGroupFieldWithError
                    className="ba b--black-40"
                    id={input.name}
                    placeHolder="Enter your email address"
                    value={input.value}
                    onChange={input.onChange}
                    autoFocus={true}
                    style={{ boxShadow: 'none', height: '42px' }}
                    error={
                      checkError(meta) &&
                      (meta.error || meta.submitError)
                    }
                  />
                )}
              />
              <Button
                className="grow pointer white bp3-minimal w-100 mt3"
                style={{
                  background: '#08A0F7',
                  outline: 'none',
                  color: 'white',
                  height: '42px',
                  fontSize: '1rem',
                }}
                loading={submitting}
                type="submit"
                disabled={submitting || pristine}
              >
                Send
              </Button>
            </form>
          )}
        />
        <div className="center w-15-ns tc mv3 fw6">
          <a
            href="/signin"
            className="link black hover-blue tc"
            style={{ fontSize: '1rem', outline: '0px' }}
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

const RouteToEmailConfirmation = () => (
  <div className="flex flex-column cf w-100 vh-100">
    <div
      className="flex flex-column justify-center"
      style={{ height: '90vh' }}
    >
      <h1 className="f3 lh-copy tc">We have sent you a mail.</h1>
      <h1 className="f3 lh-copy tc ma0">
        Please go to your mail to reset your password
      </h1>
    </div>
    <div className="pl3 w-100" style={{ height: '10vh' }}>
      <Link to={`/signin`}>
        <Button
          text="Back to Sign In"
          minimal={true}
          icon="arrow-left"
        />
      </Link>
    </div>
  </div>
);

export const ForgotPasswordPage = () => {
  const [emailComponentView, setEmailComponentView] = useState(false);
  return emailComponentView === false ? (
    <ForgotPasswordComponnet
      setEmailComponentView={setEmailComponentView}
    />
  ) : (
    <RouteToEmailConfirmation />
  );
};

export default ForgotPasswordPage;
