import * as React from 'react'
import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { InputGroupField } from 'components/common/field/InputGroup';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginAction } from 'stores/auth/Actions';
import { Icon, Intent, Spinner, Button } from '@blueprintjs/core';
import { History } from 'history';

interface SignInPageComponentProps {
  errorUnauthorized: { email: boolean; password: boolean; message: string; network: boolean }
  loading: boolean;
  loginAction: (val: any, history: History) => void;
}

const SignInPageComponent = (props: SignInPageComponentProps & RouteComponentProps) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  //need to fix this
  useEffect(() => {
    props.errorUnauthorized.email = false;
    props.errorUnauthorized.password = false;
    props.errorUnauthorized.message = "";
    props.errorUnauthorized.network = false;
  });

  const { email, password } = values;
  const [showPassword, setShowPassword] = useState(false);

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

  const emptyValueCheck = () => {
    if (isEmpty(values.email) || isEmpty(values.password)) {
      let e = errors;
      if (isEmpty(values.email)) {
        e = { ...e, email: "Required" };
      }
      if (isEmpty(values.password)) {
        e = { ...e, password: "Required" };
      }
      setErrors(e);
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
    <div className="cf ph2-ns signinPageBackground">
      <div className="fl w-100 w-50-ns dt vh-100">
        <div className="v-mid dtc">
          <div className="w-50 center">
            <Link to="/home">
              <img className="w-30" src={require('./../resources/images/tigrowLogo.png')} />
            </Link>

            <h3 className="tj" style={{ color: "#707070" }}>
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
      <div className="w-50-ns dt vh-100">
        <div className=" v-mid dtc">
          <div className="w-60-l w-90-m ">
            <form className="dt fl cf w-100">
              <div className="mw9 center ph3-ns v-mid dtc">
                {props.errorUnauthorized.email || props.errorUnauthorized.network ?
                  <small className="red">{props.errorUnauthorized.message}</small>
                  : ""}
                <div className={`${errors.email ? "mb3" : "mb4"}`}>
                  <div className="flex">
                    <InputGroupField
                      id="email"
                      value={email}
                      onChange={handleChange("email")}
                      placeHolder="Email"
                      leftIcon="envelope"
                      className={`${props.errorUnauthorized.email || errors.email ? 'bb b--red' : 'bb b--lightBlue'}`}
                      leftIconColor={`${props.errorUnauthorized.email || errors.email ? 'red' : "#0fa3a3"}`}
                      style={{
                        boxShadow: 'none',
                        fontSize: '18px'
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
                      intent={isEmpty(props.errorUnauthorized) === false ? Intent.DANGER : Intent.NONE}
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
                      placeHolder="Password"
                      leftIcon="lock"
                      className={`${props.errorUnauthorized.password || errors.password ? 'bb b--red' : 'bb b--lightBlue'}`}
                      leftIconColor={`${props.errorUnauthorized.password || errors.password ? 'red' : "#0fa3a3"}`}

                      rightElement={
                        <Icon
                          className="pt2 pr2 pointer"
                          icon={showPassword ? 'eye-open' : 'eye-off'}
                          color="#0fa3a3"
                          onClick={e => setShowPassword(!showPassword)}
                        />
                      }
                      style={{
                        boxShadow: 'none',
                        fontSize: '18px'
                      }}
                      validationOnBlur={() => {
                        if (isEmpty(password)) {
                          const passwordError = { ...errors, password: "Required" };
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
                <Button
                  type="submit"
                  className="b--none w-100 br3 fr grow h2 ph5 pointer pv2 mb3"
                  style={{ background: "#0fa3a3", outline: "none", color: 'white', fontSize: '18px' }}
                  onClick={(e: any) => {
                    e.preventDefault();
                    if (!emptyValueCheck()) {
                      props.loginAction(values, props.history);
                    }
                  }}
                  disabled={props.loading}
                >
                  {props.loading ? <Spinner size={15} /> : 'Sign in'}
                </Button>
                <div className="tc mb3">
                  <Link style={{ color: "#0fa3a3", textAlign: "center" }} to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                <div className="tc mb3">
                  <p style={{ color: "#0fa3a3" }}>
                    Don't have an Account?
                  </p>
                </div>
                <Link to="/signup">
                  <Button className="w-100 grow pointer"
                    style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3", fontSize: '18px' }}
                  >
                    Sign Up here
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.authReducer.loading,
    errorUnauthorized: state.authReducer.loginError
  };
};

export const SignInPage = connect(mapStateToProps, { loginAction })(withRouter(SignInPageComponent));