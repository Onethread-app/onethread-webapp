import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import {
  required,
  checkError,
  composeValidators,
  isEmail,
} from 'components/final-form/utils';
import {
  Link,
  NavLink,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { Button, Toaster, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import {
  loginAction,
  LoginModel,
  resendMailForSignup,
} from '../../stores/auth/Actions';
import { isEmpty, isEqual } from 'lodash';
import { SubmitError } from 'components/final-form/SubmitError';

import logo from 'resources/images/onethread-text.png';
import eyeIcon from './../../resources/images/eye.png';
import eyeClose from './../../resources/images/eyeClose.png';
import backgroundImage from './../../resources/images/Bg-png.png';
import { usePushNotifications } from '../../usePushNotifications';

interface SignInPageInternalProps {
  loginAction: (login: LoginModel) => any;
}

export const SignInPageComponent = (
  props: SignInPageInternalProps & RouteComponentProps,
) => {
  const {
    pushNotificationSupported,
    AskUserPermission,
    subscribeToPushNotification,
  } = usePushNotifications();

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('pushSubscription')) {
        if (!pushNotificationSupported) return;
        const consent = await AskUserPermission();
        if (consent === 'granted') {
          await subscribeToPushNotification();
        }
      }
    })();
  }, []);

  const onSubmit = async (values: LoginModel) => {
    const response = await props.loginAction({
      email: values.email.trim(),
      password: values.password,
      pushSubscription: localStorage.getItem('pushSubscription'),
    });
    if (response.message === 200) {
      props.history.push(`/${response.payload.data.user.name}/home`);
      return true;
    }
    switch (response.type) {
      case 'VerificationError':
        return {
          [response.fieldName]: (
            <>
              {`${response.message}.`}
              <a
                className="link dim blue pl1"
                onClick={async () => {
                  const res = await resendMailForSignup(values.email);
                  if (res.message === 200) {
                    Toaster.create().show({
                      message: 'Email has been send successfully',
                    });
                  }
                  if (isEqual(res.message, 'Network Error')) {
                    Toaster.create().show({
                      message: 'Network Error',
                    });
                  }
                }}
              >
                Resend mail?
              </a>
            </>
          ),
        };
      default:
        return { [response.fieldName]: response.message };
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    setEmail(params.get('email') ? params.get('email')! : '');
  }, [props.location.search]);

  return (
    <div className="cf">
      <div
        className="fl w-100 w-50-ns dt vh-100 displayNone"
        style={{
          zIndex: 9999,
          left: '50%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left-bottom',
          backgroundColor: '#060517',
        }}
      >
        <div className="v-mid dtc">
          <div className="w-50 center">
            <Link to="/">
              <img src={logo} alt="onethread" />
            </Link>
            <h3 className="tj mt4" style={{ color: '#E0E0E3' }}>
              Onethread is designed keeping in mind that Ease of
              Communication is the key to success for any enterprise.
              Onethread’s architecture has the key unique element of
              containerization with its feature called Project which
              ensures privacy within it, and fluidity to collaborate
              with external and internal stakeholders.
            </h3>
          </div>
        </div>
      </div>

      <div
        className="fl w-100 w-50-ns dt vh-100 pa4 pa0-ns"
        style={{ backgroundColor: 'white' }}
      >
        <div className="v-mid dtc">
          <div className="w-two-thirds-l w-90-m center">
            <Form
              onSubmit={onSubmit}
              initialValues={{
                email: email ? email : '',
                password: '',
                pushSubscription: '',
              }}
              validate={(values) => {
                const errors = {} as any;
                return errors;
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
                <>
                  <h1 className="pl3">Sign In</h1>
                  <form
                    className="fl w-100 cf"
                    onSubmit={handleSubmit}
                  >
                    <div className="mw9 center mb2">
                      <SubmitError errorMessage={submitError} />
                    </div>
                    <div>
                      <div>
                        <Field<string>
                          name="email"
                          validate={composeValidators(
                            required,
                            isEmail,
                          )}
                          render={({ input, meta }) => (
                            <div
                              className={` ${
                                checkError(meta) ? 'mb3' : 'mb4'
                              }`}
                            >
                              <InputGroupFieldWithError
                                id="email"
                                className={`bw1 pb2 br0 bb ${
                                  checkError(meta)
                                    ? 'b--red'
                                    : 'b--lightBlue'
                                }`}
                                value={input.value}
                                onChange={input.onChange}
                                leftIcon={
                                  <span className="bp3-icon">
                                    <Icon
                                      icon="envelope"
                                      style={{ color: '#3F61C5' }}
                                    />
                                  </span>
                                }
                                style={{
                                  boxShadow: 'none',
                                  fontSize: '18px',
                                  paddingLeft: '40px',
                                }}
                                placeHolder="Email Address"
                                error={
                                  checkError(meta) &&
                                  (meta.error || meta.submitError)
                                }
                                disabled={isEmpty(email) === false}
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <Field<string>
                          name="password"
                          validate={composeValidators(required)}
                          render={({ input, meta }) => (
                            <div
                              className={` ${
                                checkError(meta) ? 'mb3' : 'mb4'
                              }`}
                            >
                              <InputGroupFieldWithError
                                id="password"
                                className={`bw1 pb2 br0 bb ${
                                  checkError(meta)
                                    ? 'b--red'
                                    : 'b--lightBlue'
                                }`}
                                value={input.value}
                                onChange={input.onChange}
                                type={`${
                                  showPassword ? 'text' : 'password'
                                }`}
                                leftIcon={
                                  <span className="bp3-icon">
                                    <Icon
                                      icon="lock"
                                      style={{ color: '#3F61C5' }}
                                    />
                                  </span>
                                }
                                rightElement={
                                  <span
                                    className="bp3-icon"
                                    style={{
                                      paddingTop: '10px',
                                      paddingRight: '5px',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <img
                                      title={
                                        showPassword
                                          ? "Don't show password"
                                          : 'Show password'
                                      }
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                      src={
                                        showPassword
                                          ? eyeClose
                                          : eyeIcon
                                      }
                                      style={{
                                        width: '15px',
                                        height: '15px',
                                        color: '#3F61C5',
                                      }}
                                    />
                                  </span>
                                }
                                style={{
                                  boxShadow: 'none',
                                  fontSize: '18px',
                                  paddingLeft: '40px',
                                }}
                                placeHolder="Password"
                                error={
                                  checkError(meta) &&
                                  (meta.error || meta.submitError)
                                }
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      className="grow h2 pointer white bp3-minimal w4"
                      style={{
                        background: '#3F61C5',
                        outline: 'none',
                        color: 'white',
                        width: '100%',
                        height: '45px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                      }}
                      loading={submitting}
                      type="submit"
                      disabled={submitting || pristine}
                    >
                      Sign in
                    </Button>
                    <div className="tc mv4">
                      <NavLink
                        className="fw9 dt center tigrow-lightBlue"
                        to="/forgot-password"
                      >
                        Forget Password?
                      </NavLink>
                    </div>
                    <div className="tc mv4">
                      <NavLink
                        className="fw9 dt center tigrow-lightBlue"
                        to="/signup"
                      >
                        Don't have an account?
                      </NavLink>
                    </div>
                    <Link to="/signup">
                      <Button
                        className="w-100 grow pointer"
                        style={{
                          background: '#fff',
                          outline: 'none',
                          border: '2px solid #3F61C5',
                          color: '#3F61C5',
                          fontSize: '18px',
                          padding: '10px 0px',
                        }}
                      >
                        Sign Up here
                      </Button>
                    </Link>
                  </form>
                </>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignInPage = connect(null, { loginAction })(
  withRouter(SignInPageComponent),
);
