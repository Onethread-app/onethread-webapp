import React, { useState } from 'react';
import { InputGroupField } from 'components/common/field/InputGroup';
import { Button, Spinner } from '@blueprintjs/core';
import { isEmpty, isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { AxiosRequestConfig } from 'axios';

const ForgotPasswordComponnet = (props: { setEmailComponentView: (val: boolean) => void }) => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
  });

  const handleForgotPassword = async (email: { email: string }) => {
    try {
      setLoading(true);
      await tigrowApi.post("account/forget-password", email, {
        "Content-Type": "application/json"
      } as AxiosRequestConfig);
      setLoading(false);
      props.setEmailComponentView(true)
    } catch (error) {
      setLoading(false);
      if (isEqual(error.message, "Network Error")) {
        setErrors({ email: "Network Error" })
      } else if (error.request.status === 400) {
        setErrors({ email: error.response.data.message })
      } else {
        console.log(error.response);
      }
    }
  };

  const handleChange = (name: string) => (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  const [errors, setErrors] = useState({
    email: "",
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
    if (isEmpty(values.email)) {
      let e = errors;
      e = { ...e, email: "Required" };
      setErrors(e);
      return true;
    } else {
      return false;
    }
  }
  return (
    <div className="dt cf w-100 vh-100">
      <div className="v-mid dtc">
        <h1 className="f4 tc">Forgot your Password ?</h1>
        <h1 className="f5 fw3 tc">Don't worry ! Resetting your password is super easy.</h1>
        <h1 className="f5 fw3 tc">Enter your mail address</h1>
        <div className="w-25 cf center mt3">
          <h1 className="f6">Email</h1>
          <div className="mb3">
            <div className="flex">
              <InputGroupField
                id="email"
                type='text'
                value={values.email}
                placeHolder="Enter your email address"
                onChange={handleChange("email")}
                leftIcon="envelope"
                className="br0 bb b--lightBlue"
                leftIconColor="#0fa3a3"
                style={{
                  boxShadow: 'none',
                }}
                validationOnBlur={() => {
                  if (isEmpty(values.email)) {
                    const emailError = { ...errors, email: "Required" };
                    setErrors(emailError);
                  } else if (!emailValidation(values.email)) {
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
          <Button
            type="submit"
            className="b--none w-100 br3 fr grow h2 ph5 pointer pv2 mb3"
            style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
            onClick={(e: any) => {
              e.preventDefault();
              if (!emptyValueCheck() && !errors.email) {
                handleForgotPassword(values);
              }
            }}
            disabled={loading}
          >
            {loading ? <Spinner size={15} /> : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}

const RouteToEmailConfirmation = () => (
  <div className="dt cf w-100 vh-100">
    <div className="v-mid dtc">
      <h1 className="f4 lh-copy tc">We have sent you a mail.</h1>
      <h1 className="f4 lh-copy tc">Please go to your mail to reset your password</h1>
    </div>
  </div>
)


export const ForgotPasswordPage = () => {
  const [emailComponentView, setEmailComponentView] = useState(false);
  return (
    emailComponentView === false ?
      <ForgotPasswordComponnet setEmailComponentView={setEmailComponentView} />
      : <RouteToEmailConfirmation />
  )
}




