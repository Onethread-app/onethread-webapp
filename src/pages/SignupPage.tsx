import * as React from "react";
import { useState } from 'react';
import { isEqual, isEmpty } from 'lodash';
import { InputGroupField } from 'components/common/InputGroup';
import Artboard9 from "../resources/images/Artboard9.png";

export const SignUpPage = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { firstName, lastName, phone, email, password, confirmPassword } = values;

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const emailValidation = (email: string) => {
    const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regexForEmailValidation)) {
      return true;
    } else {
      return false;
    }
  }


  const handleChange = (name: string) => (event: any) => {
    const value = event.target.value; //avc
    setValues({ ...values, [name]: value });
  };

  const checkPassword = () => {
    if (isEqual(password, confirmPassword)) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className="cf ph2-ns">
      <div className="fl w-100 w-50-ns dt vh-100">
        <div className="v-mid dtc">
          <div className="w-50 center">
            <img className="w-75" src={Artboard9} />
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
                          placeHolder="First Name"
                          style={{
                            borderBottom: "1px solid #0fa3a3",
                            boxShadow: 'none',
                            borderRadius: '0px'
                          }}
                          validationOnBlur={() => {
                            if (firstName === "") {
                              const firstNameError = { ...errors, firstName: "Please enter your first name" };
                              setErrors(firstNameError);
                            } else {
                              const firstNameError = { ...errors, firstName: "" };
                              setErrors(firstNameError);
                            }
                          }}
                        />
                      </div>
                      {errors.firstName ? <small>enter your first name</small> : ""}
                    </div>
                    <div className="ml3">
                      <div className=" w-100">
                        <InputGroupField
                          value={lastName}
                          onChange={handleChange("lastName")}
                          placeHolder="Last Name"
                          style={{
                            borderBottom: "1px solid #0fa3a3",
                            boxShadow: 'none',
                            borderRadius: '0px'
                          }}
                          validationOnBlur={() => {
                            if (isEmpty(lastName)) {
                              const lastNameError = { ...errors, lastName: "Please enter your last name" };
                              setErrors(lastNameError);
                            } else {
                              const lastNameError = { ...errors, lastName: "" };
                              setErrors(lastNameError);
                            }
                          }}
                        />
                      </div>
                      {errors.lastName ? <small>enter your last name</small> : ""}
                    </div>
                  </div>
                  <div className={` ${errors.phone ? "mb3" : "mb4"}`}>
                    <div className="flex">
                      <InputGroupField
                        value={phone}
                        onChange={handleChange("phone")}
                        placeHolder="Contact Number"
                        leftIcon="phone"
                        leftIconColor="#0fa3a3"
                        style={{
                          borderBottom: "1px solid #0fa3a3",
                          boxShadow: 'none',
                          borderRadius: '0px'
                        }}
                        validationOnBlur={() => {
                          if (isEmpty(phone)) {
                            const numberError = { ...errors, phone: "Please enter your number" };
                            setErrors(numberError);
                          } else {
                            const numberError = { ...errors, phone: "" }
                            setErrors(numberError);
                          }
                        }}
                      />
                    </div>
                    {errors.phone ? <small>Please enter your phone number</small> : ""}
                  </div>
                  <div className={` ${errors.email ? "mb3" : "mb4"}`}>
                    <div className="flex">
                      <InputGroupField
                        value={email}
                        onChange={handleChange("email")}
                        placeHolder="Email"
                        leftIcon="envelope"
                        leftIconColor="#0fa3a3"
                        style={{
                          borderBottom: "1px solid #0fa3a3",
                          boxShadow: 'none',
                          borderRadius: '0px'
                        }}
                        validationOnBlur={() => {
                          if (isEmpty(email)) {
                            const emailError = { ...errors, email: "Please enter your email" };
                            setErrors(emailError);
                          } else if (!emailValidation(email)) {
                            const emailError = { ...errors, email: "Invalid email address" };
                            setErrors(emailError);
                          } else {
                            const emailError = { ...errors, email: "" };
                            setErrors(emailError);
                          }
                        }}
                      />
                    </div>
                    {errors.email ? <small>{errors.email}</small> : ""}

                  </div>
                  <div className={` ${errors.password ? "mb3" : "mb4"}`}>
                    <div className="flex">
                      <InputGroupField
                        value={password}
                        onChange={handleChange("password")}
                        placeHolder="Password"
                        leftIcon="lock"
                        leftIconColor="#0fa3a3"
                        style={{
                          borderBottom: "1px solid #0fa3a3",
                          boxShadow: 'none',
                          borderRadius: '0px'
                        }}
                        validationOnBlur={() => {
                          if (isEmpty(password)) {
                            const passwordError = { ...errors, password: "Please enter your password" };
                            setErrors(passwordError);
                          } else {
                            const passwordError = { ...errors, password: "" };
                            setErrors(passwordError);
                          }
                        }}
                      />
                    </div>
                    {errors.password ? <small>{errors.password}</small> : ""}

                  </div>
                  <div className={`${errors.confirmPassword ? "mb3" : "mb4"}`}>
                    <div className="flex">
                      <InputGroupField
                        value={confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        placeHolder="Confirm Password"
                        leftIcon="lock"
                        leftIconColor="#0fa3a3"
                        style={{
                          borderBottom: "1px solid #0fa3a3",
                          boxShadow: 'none',
                          borderRadius: '0px'
                        }}
                        validationOnBlur={() => {
                          if (isEmpty(confirmPassword)) {
                            const confirmPasswordError = { ...errors, confirmPassword: "Please reenter your password" };
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
                    {errors.confirmPassword ? <small>{errors.confirmPassword}</small> : ""}
                  </div>
                  <button className="b--none br3 fr grow h2 mr6-m ph5 pointer pv2 white"
                    style={{ background: "#0fa3a3", outline: "none" }}
                    onClick={e => {
                      e.preventDefault();
                      console.log(JSON.stringify(values, null, 2))
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