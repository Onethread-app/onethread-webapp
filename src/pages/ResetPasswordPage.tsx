import React, { useState, useEffect } from 'react';
import { InputGroupField } from '../components/common/field/InputGroup';
import { Button, Icon, Spinner } from '@blueprintjs/core';
import { isEmpty, isNumber, isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { AxiosRequestConfig } from 'axios';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';


const ResetPasswordComponent = (props: RouteComponentProps) => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    userID: ""
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (
    resetPasswordInfo: {},
    routeHistory: History
  ) => {
    setLoading(true);
    try {
      await tigrowApi.put("account/reset-password", resetPasswordInfo);
      setLoading(false);
      routeHistory.push("/signin");
    } catch (error) {
      setLoading(false);
      if (isEqual(error.message, "Network Error")) {
        console.log(error);
      } else {
        console.log(error.response);
      }
    }
  };

  const handleChange = (name: string | number) => (event: any) => {
    const value = isNumber(event) ? event.toString() : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const checkPassword = () => {
    if (isEqual(values.password, values.confirmPassword)) {
      return true
    } else {
      return false
    }
  }

  const emptyErrorCheck = () => {
    if (isEmpty(errors.password) && isEmpty(errors.confirmPassword)) {
      return true;
    } else {
      return false;
    }
  }
  const emptyValueCheck = () => {
    if (isEmpty(values.password) || isEmpty(values.confirmPassword)) {
      let e = errors;
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
  const getUserId = async (token: string) => {
    try {
      const response = await tigrowApi.get(`account/forget-password/${token}`, {
        "Content-Type": "application/json"
      } as AxiosRequestConfig);
      setValues({
        ...values,
        userID: response.data.user._id
      })
    }
    catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        console.log('network error')
      }
      else {
        console.log(error.response);
      }
    }
  }

  useEffect(() => {
    const token = (props.match.params as any).token;
    getUserId(token);
  }, [])
  return (
    <div className="dt w-100 vh-100">
      <div className="v-mid dtc">
        <div className="cf shadow-4 w-34 center br3 ph4">
          <h1 className="f4 lh-copy mb4 mt4">Reset Password</h1>
          <h1 className="f6">New Password</h1>
          <div className={` ${errors.password ? "mb3" : "mb4"}`}>
            <div className="flex">
              <InputGroupField
                id="password"
                type={`${showPassword ? 'text' : 'password'}`}
                value={values.password}
                onChange={handleChange("password")}
                placeHolder="password"
                leftIcon="lock"
                rightElement={
                  <Icon
                    icon={showPassword ? 'eye-open' : 'eye-off'}
                    color="#0fa3a3"
                    onClick={e => setShowPassword(!showPassword)}
                    className="pt2 pr2"
                  />
                }
                className={`br0 ${errors.password ? 'bb b--red' : 'bb b--lightBlue'}`}
                leftIconColor={`${errors.password ? 'red' : "#0fa3a3"}`}
                style={{
                  boxShadow: 'none',
                  fontSize: '18px'
                }}
                validationOnBlur={() => {
                  if (isEmpty(values.password)) {
                    const passwordError = { ...errors, password: "Required" };
                    setErrors(passwordError);
                  } else {
                    const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
                    if (!(values.password.match(regex))) {
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
          <h1 className="f6">Confirm Password</h1>
          <div className={`${errors.confirmPassword ? "mb3" : "mb4"}`}>
            <div className="flex">
              <InputGroupField
                id="confirmPassword"
                type={`${showPassword ? 'text' : 'password'}`}
                value={values.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeHolder="confirm password"
                leftIcon="lock"
                rightElement={
                  <Icon
                    icon={showPassword ? 'eye-open' : 'eye-off'}
                    color="#0fa3a3"
                    onClick={e => setShowPassword(!showPassword)}
                    className="pt2 pr2"
                  />
                }
                className={`br0 ${errors.confirmPassword ? 'bb b--red' : 'bb b--lightBlue'}`}
                leftIconColor={`${errors.confirmPassword ? 'red' : "#0fa3a3"}`}
                style={{
                  boxShadow: 'none',
                  fontSize: '18px'
                }}
                validationOnBlur={() => {
                  if (isEmpty(values.confirmPassword)) {
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

          <div className="w-30 center mt4 mb5 h2">
            <Button className=" b--none w-100 br3 fr grow h2 ph5 pointer pv2 white mb3"
              type="submit"
              style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
              onClick={(e: any) => {
                e.preventDefault();
                if (!emptyValueCheck() && emptyErrorCheck()) {
                  handleResetPassword(values, props.history);
                }
              }}
              disabled={loading}
            >
              {loading ? <Spinner size={15} /> : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}

export const ResetPasswordPage = withRouter(ResetPasswordComponent)