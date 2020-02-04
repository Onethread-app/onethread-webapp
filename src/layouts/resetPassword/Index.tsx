import React, { useState } from 'react';
import { InputGroupFieldWithError } from '../../components/fields/InputGroupField';
import { Button, Tooltip, Position } from '@blueprintjs/core';
import tigrowApi from 'tigrowApi';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { errorMessgeHandler, composeValidators, required, checkError, passwordValidation } from 'components/final-form/utils';

import lockIcon from './../../resources/images/lock.png';
import eyeIcon from './../../resources/images/eye.png';
import questionIcon from './../../resources/images/question.png';

const ResetPasswordComponent = (props: RouteComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async (values: any) => {
    try {
      await tigrowApi.put('accounts/reset-password', {
        password: values.password,
        token: (props.match.params as any).token
      });
      // if (localStorage.getItem('forgotPasswordMail')) {
      //   localStorage.removeItem('forgotPasswordMail');
      // }
      props.history.push('/signin');
      return true;
    } catch (error) {
      const response = errorMessgeHandler(error);
      return { [response.fieldName]: response.message };
      // return {
      //   [response.fieldName]: <>
      //       {`${response.message}.`}
      //       <a
      //         className="link dim blue pl1"
      //         onClick={async () => {
      //           const res = await resendMailForSignup(localStorage.getItem('forgotPasswordMail')!);
      //           if (res.message === 200) {
      //             Toaster.create().show({ message: 'Email has been send successfully' });
      //           }
      //           if (isEqual(res.message, 'Network Error')) {
      //             Toaster.create().show({ message: 'Network Error' });
      //           }
      //         }}
      //       >
      //         Resend mail?
      //       </a>
      //     </>
      // };
    }
  };

  return (
    <div className="dt w-100 vh-100">
      <div className="v-mid dtc">
        <div className="cf shadow-4 w-34 center br3 ph4">

          <Form
            onSubmit={handleResetPassword}
            validate={(values: any) => {
              const errors = {} as any;
              if (values.password !== values.confirmPassword) {
                errors.confirmPassword = 'Password does not match';
              }
              return errors;
            }}
            render={({ handleSubmit, submitting, pristine, submitError }) => (
              <>
                <h1 className="pl3">Reset Password</h1>
                <form
                  className="fl w-100 cf"
                  onSubmit={handleSubmit}>
                  <div className="mw9 center mb2">
                    <SubmitError errorMessage={submitError} />
                  </div>
                  <div>
                    <Field<string>
                      name="password"
                      validate={composeValidators(required, passwordValidation)}
                      render={({ input, meta }) =>
                        <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                          <InputGroupFieldWithError
                            id="password"
                            className={`bw1 pb2 br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                            value={input.value}
                            onChange={input.onChange}
                            type={`${showPassword ? 'text' : 'password'}`}
                            leftIcon={
                              <span className="bp3-icon">
                                <img
                                  src={lockIcon}
                                  width="20px"
                                  height="20px"
                                  color="#0fa3a3"
                                />
                              </span>
                            }
                            rightElement={
                              <span className="bp3-icon" style={{ paddingTop: '5px', paddingRight: '5px' }}>
                                <span style={{ paddingTop: '10px', paddingRight: '5px' }}>
                                  <img
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    src={eyeIcon}
                                    width="15px"
                                    height="15px"
                                    color="#0fa3a3"
                                  />
                                </span>
                                <Tooltip content={
                                  <p style={{ width: '400px' }}>
                                    Password should contain at least 1 capital letter, 1 small letter,
                                    1 special character and 1 numeric value
                                        </p>}
                                  position={Position.TOP_RIGHT}>
                                  <img
                                    src={questionIcon}
                                    width="20px"
                                    height="20px"
                                    color="#0fa3a3"
                                  />
                                </Tooltip>
                              </span>
                            }
                            style={{
                              boxShadow: 'none',
                              fontSize: '18px',
                              paddingLeft: '40px'
                            }}
                            placeHolder="Password"
                            error={checkError(meta) && (meta.error || meta.submitError)}
                          />
                        </div>
                      }
                    />
                  </div>

                  <div>
                    <Field<string>
                      name="confirmPassword"
                      validate={composeValidators(required)}
                      render={({ input, meta }) =>
                        <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                          <InputGroupFieldWithError
                            id="confirmPassword"
                            className={`bw1 pb2 br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                            value={input.value}
                            onChange={input.onChange}
                            type={`${showConfirmPassword ? 'text' : 'password'}`}
                            leftIcon={
                              <span className="bp3-icon">
                                <img
                                  src={lockIcon}
                                  width="20px"
                                  height="20px"
                                  color="#0fa3a3"
                                />
                              </span>
                            }
                            rightElement={
                              <span className="bp3-icon" style={{ paddingTop: '10px', paddingRight: '5px' }}>
                                <img
                                  onMouseDown={() => setShowConfirmPassword(true)}
                                  onMouseUp={() => setShowConfirmPassword(false)}
                                  src={eyeIcon}
                                  width="15px"
                                  height="15px"
                                  color="#0fa3a3"
                                />
                              </span>
                            }
                            style={{
                              boxShadow: 'none',
                              fontSize: '18px',
                              paddingLeft: '40px'
                            }}
                            placeHolder="Confirm Password"
                            error={checkError(meta) && (meta.error || meta.submitError)}
                          />
                        </div>
                      }
                    />
                  </div>

                  <Button
                    className=" b--none w-100 br3 fr grow h2 ph5 pointer pv2 white mb3"
                    style={{
                      background: '#0fa3a3',
                      outline: 'none',
                      color: 'white'
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
    </div >
  );
};

export const ResetPasswordPage = withRouter(ResetPasswordComponent);