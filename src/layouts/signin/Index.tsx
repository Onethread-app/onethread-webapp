import React, { useState, useEffect } from "react";
import { Form, Field } from 'react-final-form';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { required, checkError, composeValidators, isEmail } from "components/final-form/utils";
import { Link, NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { loginAction, LoginModel } from '../../stores/auth/Actions';
import { isEmpty } from 'lodash';


const logo = require('./../../resources/images/logo.png');
const emailIcon = require('./../../resources/images/email.png');
const lockIcon = require('./../../resources/images/lock.png');
const warningIcon = require('./../../resources/images/warningIcon.png');
const eyeIcon = require('./../../resources/images/eye.png');
const greyLockIcon = require('./../../resources/images/lock-grey.png');
const backgroundImage = require('./../../resources/images/Bg-png.png');

interface SignInPageInternalProps {
  loginAction: (login: LoginModel) => any
}

export const SignInPageComponent = (props: SignInPageInternalProps & RouteComponentProps) => {
  const onSubmit = async (values: LoginModel) => {

    const response = await props.loginAction(values);
    if (response.message === 200) {
      props.history.push(`/${response.payload.data.user.name}`);
      return true;
    }
    return { [response.fieldName]: response.message }
  }
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    setEmail(params.get('email') ? params.get('email')! : '');
  }, [props.location.search]);

  return (
    <div className="cf">
      <div className="fl w-100 w-50-ns dt vh-100"
        style={{
          zIndex: 9999, left: '50%', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat', backgroundPosition: 'left-bottom', backgroundColor: "#060517"
        }}
      >
        <div className="v-mid dtc">
          <div className="w-50 center">
            <Link to="/home">
              <img width="150px"
                height="70px"
                src={logo} />
            </Link>
            <h3 className="tj mt4" style={{ color: "#E0E0E3" }}>
              TiGrow is a professional network crafted for
                    Business Professionals, where they can
                    trade between each other, find nearest
                    suppliers, create workplaces in which they
                    can maintain not only intra company
                    communications but also external
                    communications with organizations where
                    they can create smart contracts between
                    them.
            </h3>
          </div>
        </div>
      </div>

      <div className="fl w-100 w-50-ns dt vh-100" style={{ backgroundColor: "white" }}>
        <div className="v-mid dtc">
          <div className="w-two-thirds-l w-90-m center">
            <Form
              onSubmit={onSubmit}
              initialValues={{ email: email ? email : '', password: '' }}
              validate={values => {
                const errors = {} as any;
                return errors;
              }}
              render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
                <>
                  <h1 className="pl3">Sign In</h1>
                  <form
                    className="fl w-100 cf"
                    onSubmit={handleSubmit}>
                    <div className="mw9 center mb2">

                      <div>
                        <Field
                          name="network"
                          subscription={{
                            touched: true,
                            error: true,
                            submitError: true,
                            dirtySinceLastSubmit: true
                          }}
                          render={({ meta }) =>
                            checkError(meta) && (
                              <div
                                className="flex"
                                style={{
                                  backgroundColor: "#FCEBEB", paddingLeft: "10px", paddingTop: "10px"
                                }}>
                                <span className="bp3-icon">
                                  <img
                                    src={warningIcon}
                                    width="20px"
                                    height="20px"
                                    color="#0fa3a3"
                                  />
                                </span>
                                <p style={{ color: "#962414", paddingLeft: "10px" }}>{meta.error || meta.submitError}</p>
                              </div>
                            )
                          }
                        />
                        <Field
                          name="authError"
                          subscription={{
                            touched: true,
                            error: true,
                            submitError: true,
                            dirtySinceLastSubmit: true
                          }}
                          render={({ meta }) =>
                            checkError(meta) && (
                              <div
                                className="flex"
                                style={{
                                  backgroundColor: "#FCEBEB", paddingLeft: "10px", paddingTop: "10px"
                                }}>
                                <span className="bp3-icon">
                                  <img
                                    src={warningIcon}
                                    width="20px"
                                    height="20px"
                                    color="#0fa3a3"
                                  />
                                </span>
                                <p style={{ color: "#962414", paddingLeft: "10px" }}>{meta.error || meta.submitError}</p>
                              </div>
                            )
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <div>
                        <Field<string>
                          name="email"
                          validate={composeValidators(required, isEmail)}
                          render={({ input, meta }) =>
                            <div className={` ${checkError(meta) ? "mb3" : "mb4"}`}>
                              <InputGroupFieldWithError
                                id="email"
                                className={`bw1 pb2 br0 bb ${checkError(meta) ? "b--red" : "b--lightBlue"}`}
                                value={input.value}
                                onChange={input.onChange}
                                leftIcon={
                                  <span className="bp3-icon">
                                    <img
                                      src={emailIcon}
                                      width="20px"
                                      height="20px"
                                      color="#0fa3a3"
                                    />
                                  </span>
                                }
                                rightElement={
                                  <span className="bp3-icon" style={{ paddingTop: "10px", paddingRight: "5px" }}>
                                    <img
                                      src={greyLockIcon}
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
                                placeHolder="Email Address"
                                error={checkError(meta) && (meta.error || meta.submitError)}
                                disabled={isEmpty(email) === false}
                              />
                            </div>
                          }
                        />
                      </div>
                    </div>


                    <div>
                      <div>
                        <Field<string>
                          name="password"
                          validate={composeValidators(required)}
                          render={({ input, meta }) =>
                            <div className={` ${checkError(meta) ? "mb3" : "mb4"}`}>
                              <InputGroupFieldWithError
                                id="password"
                                className={`bw1 pb2 br0 bb ${checkError(meta) ? "b--red" : "b--lightBlue"}`}
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
                                  <span className="bp3-icon" style={{ paddingTop: "10px", paddingRight: "5px" }}>
                                    <img
                                      onMouseDown={() => setShowPassword(true)}
                                      onMouseUp={() => setShowPassword(false)}
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
                                placeHolder="Password"
                                error={checkError(meta) && (meta.error || meta.submitError)}
                              />
                            </div>
                          }
                        />

                      </div>
                    </div>

                    <Button
                      className="grow h2 pointer white bp3-minimal w4"
                      style={{
                        background: "#0FA3A3",
                        outline: "none",
                        color: "white",
                        width: '100%',
                        height: '45px',
                        fontWeight: "bold",
                        fontSize: "1.2rem"
                      }}
                      loading={submitting}
                      type="submit"
                      disabled={submitting || pristine}
                    >
                      Sign in
                    </Button>
                    <div className="tc mv4">
                      <NavLink className="fw9 dt center tigrow-lightBlue" to="/forgot-password">
                        Forget Password ?
                      </NavLink>
                    </div>
                    <div className="tc mv4">
                      <NavLink className="fw9 dt center tigrow-lightBlue" to="/signup">
                        Don't have an account?
                      </NavLink>
                    </div>
                    <Link to="/signup">
                      <Button className="w-100 grow pointer"
                        style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3", fontSize: '18px' }}
                      >
                        Sign Up here
                        </Button>
                    </Link>

                  </form>
                </>

              )
              }
            />
          </div>

        </div>
      </div>



    </div>
  )
}

export const SignInPage = connect(null, { loginAction })(withRouter(SignInPageComponent));