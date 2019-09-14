import * as React from 'react'
import { useState } from 'react';
import { isEmpty } from 'lodash';
import { InputGroupField } from 'components/common/InputGroup';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginAction } from 'actions/AuthActions';


const SignInPageComponent = (props: any) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const { email, password } = values;

  const [errors, setErrors] = useState({
    email: "",
    password: "",
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
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  return (
    <div className="cf ph2-ns">
      <div className="fl w-100 w-50-ns dt vh-100">
        <div className="v-mid dtc">
          <div className="w-50 center">
            <img className="w-30" src={require('./../resources/images/Asset__1.png')} />

            <h3 style={{ color: "#707070" }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
            </h3>
          </div>
        </div>
      </div>
      <div className="fl w-100 w-50-ns dt pt4 vh-100">
        <div className=" v-mid dtc">
          <div className="w-two-thirds ">
            <div className="mt3">
              <form className="dt fl cf w-100">
                <div className="mw9 center ph3-ns v-mid dtc">
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
                    {errors.email ? <small className="red">{errors.email}</small> : ""}

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
                    {errors.password ? <small className="red">{errors.password}</small> : ""}
                  </div>
                  <button className="b--none w-100 br3 fr grow h2 mr6-m ph5 pointer pv2 white mb3"
                    style={{ background: "#0fa3a3", outline: "none" }}
                    onClick={e => {
                      e.preventDefault();
                      console.log(JSON.stringify(values, null, 2));
                      props.loginAction(values, props.history);
                    }}
                  >
                    Sign In
                  </button>
                  <div className="mb3 tc">
                    <a href="" style={{ color: "#0fa3a3" }}>
                      Forgot Password?
                    </a>
                  </div>
                  <div className="tc mb2">
                    <p style={{ color: "#0fa3a3" }}>
                      Don't have an Account?
                  </p>
                  </div>
                  <Link to="/signuppage">
                    <button className="b--none w-100 br3 fr grow h2 mr6-m ph5 pointer pv2 white"
                      style={{ background: "#0fa3a3", outline: "none" }}
                    >
                      Sign Up here
                  </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SignInPage = connect(null, { loginAction })(withRouter(SignInPageComponent));