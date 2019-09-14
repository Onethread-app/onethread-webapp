import * as React from "react";
import { useState } from 'react';
import { isEqual, isEmpty, isNumber } from 'lodash';
import { InputGroupField } from 'components/common/InputGroup';
import { NumericInput, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { newUserAction } from 'actions/AuthActions';
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
  newUserAction: (user: UserModel, history: History) => void;
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
                  <div className={`flex justify-content ${errors.firstName ? "mb3" : "mb4"}`}>
                    <div>
                      <div className="flex w-100 ">
                        <InputGroupField
                          value={firstName}
                          onChange={handleChange("firstName")}
                          leftIcon="person"
                          leftIconColor="#0fa3a3"
                          placeHolder="John"
                          style={{
                            borderBottom: "1px solid #0fa3a3",
                            boxShadow: 'none',
                            borderRadius: '0px'
                          }}
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
                          value={lastName}
                          onChange={handleChange("lastName")}
                          placeHolder="Doe"
                          style={{
                            borderBottom: "1px solid #0fa3a3",
                            boxShadow: 'none',
                            borderRadius: '0px'
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
                  <div className="mw9 center mb4">
                    <div className="cf">
                      <div className="fl w-20-l w-30-m pr2">
                        <InputGroupField
                          value="+880"
                          leftIcon="phone"
                          leftIconColor="#0fa3a3"
                          style={{
                            borderBottom: "1px solid #0fa3a3",
                            boxShadow: 'none',
                            borderRadius: '0px'
                          }}
                          readOnly={true}
                        />
                      </div>
                      <div className="fl w-80-l w-70-m">
                        <div>
                          <div className="flex w-100 ">
                            <NumericInput
                              className="w-100"
                              style={{
                                borderBottom: "1px solid #0fa3a3",
                                boxShadow: 'none',
                                borderRadius: '0px',

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

                    </div>
                  </div>
                  <div className={` ${errors.email ? "mb3" : "mb4"}`}>
                    <div className="flex">
                      <InputGroupField
                        value={email}
                        onChange={handleChange("email")}
                        placeHolder="john@gmail.com"
                        leftIcon="envelope"
                        leftIconColor="#0fa3a3"
                        style={{
                          borderBottom: "1px solid #0fa3a3",
                          boxShadow: 'none',
                          borderRadius: '0px'
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
                        type={`${showPassword ? 'text' : 'password'}`}
                        value={password}
                        onChange={handleChange("password")}
                        placeHolder="password"
                        leftIcon="lock"
                        leftIconColor="#0fa3a3"
                        rightElement={
                          <Icon 
                            icon={showPassword ? 'unlock' : 'lock'}
                            color="#0fa3a3" 
                            onClick={e => setShowPassword(!showPassword)}
                          />
                        }
                        style={{
                          borderBottom: "1px solid #0fa3a3",
                          boxShadow: 'none',
                          borderRadius: '0px'
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
                        type={`${showPassword ? 'text' : 'password'}`}
                        value={confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        placeHolder="confirm password"
                        leftIcon="lock"
                        leftIconColor="#0fa3a3"
                        rightElement={
                          <Icon 
                            icon={showPassword ? 'unlock' : 'lock'}
                            color="#0fa3a3" 
                            onClick={e => setShowPassword(!showPassword)}
                          />
                        }
                        style={{
                          borderBottom: "1px solid #0fa3a3",
                          boxShadow: 'none',
                          borderRadius: '0px'
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
                  <button className="b--none w-100 br3 fr grow h2 mr6-m ph5 pointer pv2 white"
                    style={{ background: "#0fa3a3", outline: "none" }}
                    onClick={e => {
                      e.preventDefault();
                      if (!emptyValueCheck()) {
                        props.newUserAction(values, props.history);
                      }
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignUpPage = connect(null, { newUserAction })(withRouter(SignUpPageComponent));