import React, { useState } from 'react';
import { InputGroupField } from './field/InputGroup';
import { Button, Icon, Spinner } from '@blueprintjs/core';
import { isEmpty, isNumber, isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { withRouter, RouteComponentProps } from 'react-router';
import { tokenConfig } from 'stores/UtilsActions';
import { useStore } from 'react-redux';


const ChangePasswordComponentView = (props: { setShowDialog: (val: boolean) => void } & RouteComponentProps) => {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = async (
    changePasswordInfo: {}
  ) => {
    setLoading(true);
    try {
      const headers = tokenConfig(store.getState);
      if ((headers as any).headers.Authorization) {
        await tigrowApi.put("accounts/change-password", changePasswordInfo, headers);
        setLoading(false);
      } else {
        console.log("error in user fetching");
      }
    }
    catch (error) {
      setLoading(false);
      let e = errors;
      if (isEqual(error.message, "Network Error")) {
        console.log(error);
      } else if (error.response.request.status === 401) {
        console.log(error.response.data.message);
        e = { ...e, oldPassword: error.response.data.message };
        setErrors(e);
        console.log(errors);

      } else if (error.response.request.status === 400) {
        console.log(error.response.data.message);
        e = { ...e, oldPassword: error.response.data.message };
        setErrors(e);
        console.log(errors);

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
    if (isEqual(values.newPassword, values.confirmPassword)) {
      return true
    } else {
      return false
    }
  }

  const emptyErrorCheck = () => {
    if (isEmpty(errors.newPassword) && isEmpty(errors.confirmPassword) && isEmpty(errors.oldPassword)) {
      return true;
    } else {
      return false;
    }
  }
  const emptyValueCheck = () => {
    if (isEmpty(values.newPassword) || isEmpty(values.confirmPassword) || isEmpty(values.oldPassword)) {
      let e = errors;
      if (isEmpty(values.newPassword)) {
        e = { ...e, newPassword: "Required" };
      }
      if (isEmpty(values.confirmPassword)) {
        e = { ...e, confirmPassword: "Required" };
      }
      if (isEmpty(values.oldPassword)) {
        e = { ...e, oldPassword: "Required" };
      }
      setErrors(e);
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="pa4">
      <h1 className="f5 lh-title tigrow-lightBlue mb4">Change Password</h1>
      <h1 className="f6">Old Password</h1>
      <div className={` ${errors.oldPassword ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="oldPassword"
            type={`${showPassword ? 'text' : 'password'}`}
            value={values.oldPassword}
            onChange={handleChange("oldPassword")}
            placeHolder="Old Password"
            leftIcon="lock"
            rightElement={
              <Icon
                icon={showPassword ? 'eye-open' : 'eye-off'}
                color="#0fa3a3"
                onClick={e => setShowPassword(!showPassword)}
                className="pt2 pr2 pointer"
              />
            }
            className={`br0 ${errors.oldPassword ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.oldPassword ? 'red' : "#0fa3a3"}`}
            style={{
              boxShadow: 'none',
            }}
            validationOnBlur={() => {
              if (isEmpty(values.oldPassword)) {
                const passwordError = { ...errors, oldPassword: "Required" };
                setErrors(passwordError);
              } else {
                const passwordError = { ...errors, oldPassword: "" };
                setErrors(passwordError);
              }
            }}
          />
        </div>
        {errors.oldPassword ? <small className="red">{errors.oldPassword}</small> : ""}

      </div>
      <h1 className="f6">New Password</h1>
      <div className={` ${errors.newPassword ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="password"
            type={`${showPassword ? 'text' : 'password'}`}
            value={values.newPassword}
            onChange={handleChange("newPassword")}
            placeHolder="New Password"
            leftIcon="lock"
            rightElement={
              <Icon
                icon={showPassword ? 'eye-open' : 'eye-off'}
                color="#0fa3a3"
                onClick={e => setShowPassword(!showPassword)}
                className="pt2 pr2 pointer"
              />
            }
            className={`br0 ${errors.newPassword ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.newPassword ? 'red' : "#0fa3a3"}`}
            style={{
              boxShadow: 'none',
            }}
            validationOnBlur={() => {
              if (isEmpty(values.newPassword)) {
                const passwordError = { ...errors, newPassword: "Required" };
                setErrors(passwordError);
              } else {
                const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
                if (!(values.newPassword.match(regex))) {
                  const passwordError = { ...errors, newPassword: "Should contain uppercase, lowercase, special character and min 8 chanracter long" };
                  setErrors(passwordError);
                } else {
                  const passwordError = { ...errors, newPassword: "" };
                  setErrors(passwordError);
                }
              }
            }}
          />
        </div>
        {errors.newPassword ? <small className="red">{errors.newPassword}</small> : ""}

      </div>
      <h1 className="f6">Confirm Password</h1>
      <div className={`${errors.confirmPassword ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="confirmPassword"
            type={`${showPassword ? 'text' : 'password'}`}
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeHolder="Confirm Password"
            leftIcon="lock"
            rightElement={
              <Icon
                icon={showPassword ? 'eye-open' : 'eye-off'}
                color="#0fa3a3"
                onClick={e => setShowPassword(!showPassword)}
                className="pt2 pr2 pointer"
              />
            }
            className={`br0 ${errors.confirmPassword ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.confirmPassword ? 'red' : "#0fa3a3"}`}
            style={{
              boxShadow: 'none',
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
      <div className="flex justify-end">
        <Button className="w4 grow h2 pointer mr3"
          style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
          onClick={(e: any) => {
            e.preventDefault();
            props.setShowDialog(false);
          }}
        >
          cancel
        </Button>
        <Button
          type="submit"
          className="w4 grow h2 pointer"
          style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
          onClick={(e: any) => {
            e.preventDefault();
            let changePasswordvalues = {
              oldPassword: values.oldPassword,
              newPassword: values.newPassword,
            }
            if (!emptyValueCheck() && emptyErrorCheck()) {
              props.setShowDialog(false);
              handleChangePassword(changePasswordvalues);
            }
          }}
          disabled={loading}
        >
          {loading ? <Spinner size={15} /> : 'Submit'}
        </Button>
      </div>
    </div>
  )
}

export const ChangePasswordComponent = withRouter(ChangePasswordComponentView)