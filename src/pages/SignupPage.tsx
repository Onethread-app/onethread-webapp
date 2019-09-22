import * as React from "react";
import { useState } from 'react';
import { isEqual, isEmpty, isNumber } from 'lodash';
import { InputGroupField } from 'components/common/InputGroup';
import { NumericInput, Icon, Spinner, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { userSignupAction } from 'actions/AuthActions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';

interface UserModel {
  firstName: string,
  lastName: string,
  contactNo: string,
  email: string,
  password: string,
  confirmPassword: string,
}

interface SignUpPageInternalProps {
  errorUnauthorized: { email: boolean; message: string; network: boolean }
  loading: boolean;
  userSignupAction: (user: UserModel, history: History) => void;
}

const SignUpPageComponent = (props: SignUpPageInternalProps & RouteComponentProps) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { firstName, lastName, contactNo, email, password, confirmPassword } = values;

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const emailValidation = (email: string) => {
    const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regexForEmailValidation)) {
      return true;
    } else {
      return false;
    }
  }


  const handleChange = (name: string | number) => (event: any) => {
    const value = isNumber(event) ? event.toString() : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const checkPassword = () => {
    if (isEqual(password, confirmPassword)) {
      return true
    } else {
      return false
    }
  }

  const emptyValueCheck = () => {
    if (isEmpty(values.firstName) || isEmpty(values.lastName) || isEmpty(values.contactNo) || isEmpty(values.email) || isEmpty(values.password) || isEmpty(values.confirmPassword)) {
      let e = errors;
      if (isEmpty(values.firstName)) {
        e = { ...e, firstName: "Required" };
      }
      if (isEmpty(values.lastName)) {
        e = { ...e, lastName: "Required" };
      }
      if (isEmpty(values.contactNo)) {
        e = { ...e, contactNo: "Required" };
      }
      if (isEmpty(values.email)) {
        e = { ...e, email: "Required" };
      }
      if (isEmpty(values.password)) {
        e = { ...e, password: "Required" };
      }
      if (isEmpty(values.confirmPassword)) {
        e = { ...e, confirmPassword: "Required" };
      }
      setErrors(e);
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="cf ph2-ns">
      <div className="fl w-100 w-50-ns dt vh-100">
        <div className="v-mid dtc">
          <div className="w-50 center">
            <img className="w-75" src={require('./../resources/images/Artboard9.png')} />
            <h2 className="mt0" style={{ color: "#0fa3a3" }}>
              Individual
            </h2>
            <p style={{ color: "#707070" }}>
              Search for jobs, Track your task and projects.
            </p>
          </div>
        </div>
      </div>
      <div className="fl w-100 w-50-ns dt pt4 vh-100">
        <div className=" v-mid dtc">
          <div className="w-two-thirds ">
            <div className="mt3">
              <form className="dt fl cf">
                <div className="mw9 center ph3-ns v-mid dtc">
                  {props.errorUnauthorized.email || props.errorUnauthorized.network ?
                    <small className="red">{props.errorUnauthorized.message}</small>
                    : ""}
                  <div className={`flex pt3 justify-content ${errors.firstName ? "mb3" : "mb4"}`}>
                    <div>
                      <div className=" w-100 ">
                        <InputGroupField
                          id="firstName"
                          value={firstName}
                          onChange={handleChange("firstName")}
                          leftIcon="person"
                          className={`br0 ${errors.firstName ? 'bb b--red' : 'bb b--lightBlue'}`}
                          leftIconColor={`${errors.firstName ? 'red' : "#0fa3a3"}`}
                          style={{
                            boxShadow: 'none',
                          }}
                          placeHolder="John"
                          validationOnBlur={() => {
                            if (firstName === "") {
                              const firstNameError = { ...errors, firstName: "Required" };
                              setErrors(firstNameError);
                            } else {
                              const firstNameError = { ...errors, firstName: "" };
                              setErrors(firstNameError);
                            }
                          }}
                        />
                      </div>
                      {errors.firstName ? <small className="red">{errors.firstName}</small> : ""}
                    </div>
                    <div className="ml3">
                      <div className=" w-100">
                        <InputGroupField
                          id="lastName"
                          value={lastName}
                          onChange={handleChange("lastName")}
                          placeHolder="Doe"
                          className={`br0 ${errors.lastName ? 'bb b--red' : 'bb b--lightBlue'}`}

                          style={{
                            boxShadow: 'none',
                          }}
                          validationOnBlur={() => {
                            if (isEmpty(lastName)) {
                              const lastNameError = { ...errors, lastName: "Required" };
                              setErrors(lastNameError);
                            } else {
                              const lastNameError = { ...errors, lastName: "" };
                              setErrors(lastNameError);
                            }
                          }}
                        />
                      </div>
                      {errors.lastName ? <small className="red">{errors.lastName}</small> : ""}
                    </div>
                  </div>
                  <div className="flex justify-content mb4">

                    <div className="w-25-ns w-20-l">

                      <div className=" w-100">
                        <InputGroupField
                          id="contactNo"
                          value="+880"
                          leftIcon="phone"
                          className={`br0 ${errors.contactNo ? 'bb b--red' : 'bb b--lightBlue'}`}
                          leftIconColor={`${errors.contactNo ? 'red' : "#0fa3a3"}`}
                          style={{
                            boxShadow: 'none',
                          }}
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div className="w-75-ns w-80-l ml3">


                      <div className="w-100 ">
                        <NumericInput
                          className={`br0 ${errors.contactNo ? 'bb b--red' : 'bb b--lightBlue'} w-100`}

                          style={{
                            boxShadow: 'none',
                          }}
                          fill={true}
                          placeholder="e.g. 1789442325"
                          value={contactNo}
                          onValueChange={handleChange("contactNo")}
                          buttonPosition="none"
                          onBlur={() => {
                            if (isEmpty(contactNo)) {
                              const contactNoError = { ...errors, contactNo: "Required" };
                              setErrors(contactNoError);
                            } else if (contactNo.length !== 10) {
                              const contactNoError = { ...errors, contactNo: "Not more or less than 10 character" };
                              setErrors(contactNoError);
                            }
                            else {
                              const contactNoError = { ...errors, contactNo: "" };
                              setErrors(contactNoError);
                            }
                          }}
                        />
                      </div>
                      {errors.contactNo ? <small className="red">{errors.contactNo}</small> : ""}

                    </div>
                  </div>
                  <div className={` ${errors.email ? "mb3" : "mb4"}`}>
                    <div className="flex">
                      <InputGroupField
                        id="email"
                        value={email}
                        onChange={handleChange("email")}
                        placeHolder="john@gmail.com"
                        leftIcon="envelope"
                        className={`br0 ${props.errorUnauthorized.email || errors.email ? 'bb b--red' : 'bb b--lightBlue'}`}
                        leftIconColor={`${props.errorUnauthorized.email || errors.email ? 'red' : "#0fa3a3"}`}
                        style={{
                          boxShadow: 'none',
                        }}
                        validationOnBlur={() => {
                          if (isEmpty(email)) {
                            const emailError = { ...errors, email: "Required" };
                            setErrors(emailError);
                          } else if (!emailValidation(email)) {
                            const emailError = { ...errors, email: "Email should contain @ and . sign" };
                            setErrors(emailError);
                          } else {
                            const emailError = { ...errors, email: "" };
                            setErrors(emailError);
                          }
                        }}
                      />
                    </div>
                    {errors.email ? <small className="red">{errors.email}</small> : ""}

                  </div>
                  <div className={` ${errors.password ? "mb3" : "mb4"}`}>
                    <div className="flex">
                      <InputGroupField
                        id="password"
                        type={`${showPassword ? 'text' : 'password'}`}
                        value={password}
                        onChange={handleChange("password")}
                        placeHolder="password"
                        leftIcon="lock"

                        rightElement={
                          <Icon
                            icon={showPassword ? 'unlock' : 'lock'}
                            color="#0fa3a3"
                            onClick={e => setShowPassword(!showPassword)}
                            className="pt2 pr2"
                          />
                        }
                        className={`br0 ${errors.password ? 'bb b--red' : 'bb b--lightBlue'}`}
                        leftIconColor={`${errors.password ? 'red' : "#0fa3a3"}`}
                        style={{
                          boxShadow: 'none',
                        }}
                        validationOnBlur={() => {
                          if (isEmpty(password)) {
                            const passwordError = { ...errors, password: "Required" };
                            setErrors(passwordError);
                          } else {
                            const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
                            if (!(password.match(regex))) {
                              const passwordError = { ...errors, password: "Should contain uppercase, lowercase, special character and min 8 chanracter long" };
                              setErrors(passwordError);
                            } else {
                              const passwordError = { ...errors, password: "" };
                              setErrors(passwordError);
                            }
                          }
                        }}
                      />
                    </div>
                    {errors.password ? <small className="red">{errors.password}</small> : ""}

                  </div>
                  <div className={`${errors.confirmPassword ? "mb3" : "mb4"}`}>
                    <div className="flex">
                      <InputGroupField
                        id="confirmPassword"
                        type={`${showPassword ? 'text' : 'password'}`}
                        value={confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        placeHolder="confirm password"
                        leftIcon="lock"

                        rightElement={
                          <Icon
                            icon={showPassword ? 'unlock' : 'lock'}
                            color="#0fa3a3"
                            onClick={e => setShowPassword(!showPassword)}
                            className="pt2 pr2"
                          />
                        }
                        className={`br0 ${errors.confirmPassword ? 'bb b--red' : 'bb b--lightBlue'}`}
                        leftIconColor={`${errors.confirmPassword ? 'red' : "#0fa3a3"}`}
                        style={{
                          boxShadow: 'none',
                        }}
                        validationOnBlur={() => {
                          if (isEmpty(confirmPassword)) {
                            const confirmPasswordError = { ...errors, confirmPassword: "Please re-enter your password" };
                            setErrors(confirmPasswordError);
                          }
                          else if (!checkPassword()) {
                            const confirmPasswordError = { ...errors, confirmPassword: "Mismatch Password" };
                            setErrors(confirmPasswordError);
                          }
                          else {
                            const confirmPasswordError = { ...errors, confirmPassword: "" };
                            setErrors(confirmPasswordError);
                          }
                        }}
                      />
                    </div>
                    {errors.confirmPassword ? <small className="red">{errors.confirmPassword}</small> : ""}
                  </div>
                  <Button className=" b--none w-100 br3 fr grow h2 mr6-m ph5 pointer pv2 white"
                    type="submit"
                    style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
                    onClick={(e:any) => {
                      e.preventDefault();
                      if (!emptyValueCheck()) {
                        props.userSignupAction(values, props.history);
                      }
                    }}
                    disabled={props.loading}
                  >
                    {props.loading ? <Spinner size={15} /> : 'Sign up'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return { 
    loading: state.auth.loading,
    errorUnauthorized: state.auth.loginError };
};

export const SignUpPage = connect(mapStateToProps, { userSignupAction })(withRouter(SignUpPageComponent));