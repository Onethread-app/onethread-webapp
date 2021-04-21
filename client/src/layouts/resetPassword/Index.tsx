import React, { useState } from 'react';
import { InputGroupFieldWithError } from '../../components/fields/InputGroupField';
import { Button } from '@blueprintjs/core';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import {
  errorMessgeHandler,
  composeValidators,
  required,
  checkError,
  passwordValidation,
} from 'components/final-form/utils';

import lockIcon from './../../resources/images/lock.png';
import eyeIcon from './../../resources/images/eye.png';
// import questionIcon from './../../resources/images/question.png';
import { Link } from 'react-router-dom';
import { tigrowApi } from 'config';
import InputTooltip from 'components/input-tooltip/InputTooltip';
const validation = {
  rules: [
    'At least 1 capital letter',
    'At least 1 small letter',
    'At least 1 special character',
    'At least 1 numeric value',
  ],
};
const ResetPasswordComponent = (props: RouteComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(
    false,
  );

  const handleResetPassword = async (values: any) => {
    try {
      await tigrowApi.put('accounts/reset-password', {
        password: values.password,
        token: (props.match.params as any).token,
      });
      props.history.push('/signin');
      return true;
    } catch (error) {
      const response = errorMessgeHandler(error);
      return {
        [response.fieldName]: (
          <>
            {`${response.message}.`}
            <Link to="/forgot-password">Resend mail?</Link>
          </>
        ),
      };
    }
  };

  return (
    <div className="dt w-100 vh-100">
      <div className="v-mid dtc">
        <div className="cf shadow-4-ns w-34-ns center br3 ph4">
          <Form
            onSubmit={handleResetPassword}
            validate={(values: any) => {
              const errors = {} as any;
              if (values.password !== values.confirmPassword) {
                errors.confirmPassword = 'Password does not match';
              }
              return errors;
            }}
            render={({
              handleSubmit,
              submitting,
              pristine,
              submitError,
            }) => (
              <>
                <h1 className="pl3">Reset Password</h1>
                <form className="fl w-100 cf" onSubmit={handleSubmit}>
                  <div className="mw9 center mb2">
                    <SubmitError errorMessage={submitError} />
                  </div>
                  <div>
                    <Field<string>
                      name="password"
                      validate={composeValidators(
                        required,
                        passwordValidation,
                      )}
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
                                <img
                                  src={lockIcon}
                                  width="20px"
                                  height="20px"
                                  color="#3F61C5"
                                />
                              </span>
                            }
                            rightElement={
                              <span
                                className="bp3-icon"
                                style={{
                                  paddingTop: '5px',
                                }}
                              >
                                <span
                                  style={{
                                    paddingTop: '10px',
                                    paddingRight: '5px',
                                  }}
                                >
                                  <img
                                    onMouseDown={() =>
                                      setShowPassword(true)
                                    }
                                    onMouseUp={() =>
                                      setShowPassword(false)
                                    }
                                    src={eyeIcon}
                                    width="15px"
                                    height="15px"
                                    color="#3F61C5"
                                  />
                                </span>
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '40px',
                                  }}
                                  className="hidden-small"
                                >
                                  <InputTooltip
                                    content="Choose a password at least 8 characters long"
                                    direction="right"
                                    validations={validation}
                                  >
                                    <span
                                      role="img"
                                      aria-label="question mark"
                                    >
                                      <img
                                        src="https://svgshare.com/i/Q3c.svg"
                                        alt="question mark logo"
                                      />
                                    </span>
                                  </InputTooltip>
                                </span>
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

                  <div>
                    <Field<string>
                      name="confirmPassword"
                      validate={composeValidators(required)}
                      render={({ input, meta }) => (
                        <div
                          className={` ${
                            checkError(meta) ? 'mb3' : 'mb4'
                          }`}
                        >
                          <InputGroupFieldWithError
                            id="confirmPassword"
                            className={`bw1 pb2 br0 bb ${
                              checkError(meta)
                                ? 'b--red'
                                : 'b--lightBlue'
                            }`}
                            value={input.value}
                            onChange={input.onChange}
                            type={`${
                              showConfirmPassword
                                ? 'text'
                                : 'password'
                            }`}
                            leftIcon={
                              <span className="bp3-icon">
                                <img
                                  src={lockIcon}
                                  width="20px"
                                  height="20px"
                                  color="#3F61C5"
                                />
                              </span>
                            }
                            rightElement={
                              <span
                                className="bp3-icon"
                                style={{
                                  paddingTop: '10px',
                                  paddingRight: '5px',
                                }}
                              >
                                <img
                                  onMouseDown={() =>
                                    setShowConfirmPassword(true)
                                  }
                                  onMouseUp={() =>
                                    setShowConfirmPassword(false)
                                  }
                                  src={eyeIcon}
                                  width="15px"
                                  height="15px"
                                  color="#3F61C5"
                                />
                              </span>
                            }
                            style={{
                              boxShadow: 'none',
                              fontSize: '18px',
                              paddingLeft: '40px',
                            }}
                            placeHolder="Confirm Password"
                            error={
                              checkError(meta) &&
                              (meta.error || meta.submitError)
                            }
                          />
                        </div>
                      )}
                    />
                  </div>

                  <Button
                    className=" b--none w-100 fr grow h2 ph5 pointer pv2 white mb3"
                    style={{
                      background: '#3F61C5',
                      outline: 'none',
                      color: 'white',
                    }}
                    loading={submitting}
                    type="submit"
                    disabled={submitting || pristine}
                    text="Submit"
                  />
                </form>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordPage = withRouter(ResetPasswordComponent);
