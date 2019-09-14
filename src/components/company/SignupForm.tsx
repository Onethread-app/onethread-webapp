import React, { useState } from 'react'
import { InputGroupField } from 'components/common/InputGroup';
import { isEmpty } from 'lodash';
import { HTMLSelect } from '@blueprintjs/core';

export const CompanySignupForm = () => {
  const [values, setValues] = useState({
    companyName: "",
    companyEmailAddress: "",
    legalOwnersName: "",
    legalOwnersEmailAddress: "",
    location: ""
  });

  const [errors, setErrors] = useState({
    companyName: "",
    companyEmailAddress: "",
    legalOwnersName: "",
    legalOwnersEmailAddress: "",
    locationName: ""
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

  const onChangeSelectField = (name: string) => (event: any) => {
    const value = event.currentTarget.value;
    setValues({ ...values, [name]: value });
  }

  return (
    <form className="fl w-100 pa2">
      <div className={` ${errors.companyName ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            value={values.companyName}
            onChange={handleChange("companyName")}
            placeHolder="Company Name"
            leftIcon="briefcase"
            leftIconColor="#0fa3a3"
            style={{
              borderBottom: "1px solid #0fa3a3",
              boxShadow: 'none',
              borderRadius: '0px',
              backgroundColor: 'none'
            }}
            validationOnBlur={() => {
              if (isEmpty(values.companyName)) {
                const companyNameError = { ...errors, companyName: "Please enter company name" };
                setErrors(companyNameError);
              } else {
                const companyNameError = { ...errors, companyName: "" }
                setErrors(companyNameError);
              }
            }}
          />
        </div>
        {errors.companyName ? <small style={{ color: 'red' }}>{errors.companyName}</small> : ""}
      </div>
      <div className="flex mb4">
        <div className=" bp3-icon-map-marker f5 pa1 bb b--lightBlue"
          style={{
            color: "#0fa3a3",
          }}
        ></div>
        <HTMLSelect
          fill={true}
          minimal={true}
          onChange={onChangeSelectField('location')}
          className=" bb b--lightBlue"
          style={{
            boxShadow: 'none',
            flex: '1',
            outline: 'none',
            borderRadius: "0px",
            background: "white"
          }}
        >
          <option selected value="Dhaka">Dhaka</option>
          <option value="Chittagong">Chittagong</option>
          <option value="Khulna">Khulna</option>
          <option value="Rajshahi">Rajshahi</option>
          <option value="Barishal">Barishal</option>
          <option value="Sylhet">Sylhet</option>
        </HTMLSelect>

      </div>

      <div className="flex mb4">
        <div className=" bp3-icon-briefcase f5 pa1 bb b--lightBlue"
          style={{
            color: "#0fa3a3"
          }}
        ></div>
        <HTMLSelect
          fill={true}
          minimal={true}
          onChange={onChangeSelectField('companyType')}
          className=" bb b--lightBlue"
          style={{
            boxShadow: 'none',
            borderRadius: '0px',
            backgroundColor: 'white',
            flex: '1',
            outline: 'none'
          }}
        >
          <option selected value="Industrial">Industrial</option>
          <option value="Agricultural">Agricultural</option>
        </HTMLSelect>
      </div>

      <div className={` ${errors.companyEmailAddress ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            value={values.companyEmailAddress}
            onChange={handleChange("companyEmailAddress")}
            placeHolder="Company Email Address"
            leftIcon="envelope"
            leftIconColor="#0fa3a3"
            style={{
              borderBottom: "1px solid #0fa3a3",
              boxShadow: 'none',
              borderRadius: '0px'
            }}
            validationOnBlur={() => {
              if (isEmpty(values.companyEmailAddress)) {
                const companyEmailError = { ...errors, companyEmailAddress: "Please enter company email" };
                setErrors(companyEmailError);
              } else if (!emailValidation(values.companyEmailAddress)) {
                const companyEmailError = { ...errors, companyEmailAddress: "Invalid email address!" };
                setErrors(companyEmailError);
              } else {
                const companyEmailError = { ...errors, companyEmailAddress: "" };
                setErrors(companyEmailError);
              }
            }}
          />
        </div>
        {errors.companyEmailAddress ? <small style={{ color: 'red' }}>{errors.companyEmailAddress}</small> : ""}
      </div>

      <div className={` ${errors.legalOwnersName ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            value={values.legalOwnersName}
            onChange={handleChange("legalOwnersName")}
            placeHolder="Legal Owner's Name"
            leftIcon="mugshot"
            leftIconColor="#0fa3a3"
            style={{
              borderBottom: "1px solid #0fa3a3",
              boxShadow: 'none',
              borderRadius: '0px'
            }}
            validationOnBlur={() => {
              if (isEmpty(values.legalOwnersName)) {
                const ownerNameError = { ...errors, legalOwnersName: "Please enter legal owner's name" };
                setErrors(ownerNameError);
              } else {
                const ownerNameError = { ...errors, legalOwnersName: "" }
                setErrors(ownerNameError);
              }
            }}
          />
        </div>
        {errors.legalOwnersName ? <small style={{ color: 'red' }}>{errors.legalOwnersName}</small> : ""}
      </div>

      <div className={` ${errors.legalOwnersEmailAddress ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            value={values.legalOwnersEmailAddress}
            onChange={handleChange("legalOwnersEmailAddress")}
            placeHolder="Legal Owner's Email Address"
            leftIcon="envelope"
            leftIconColor="#0fa3a3"
            style={{
              borderBottom: "1px solid #0fa3a3",
              boxShadow: 'none',
              borderRadius: '0px'
            }}
            validationOnBlur={() => {
              if (isEmpty(values.legalOwnersEmailAddress)) {
                const ownerEmailError = { ...errors, legalOwnersEmailAddress: "Please enter legal owner's email address" };
                setErrors(ownerEmailError);
              } else if (!emailValidation(values.legalOwnersEmailAddress)) {
                const emailError = { ...errors, legalOwnersEmailAddress: "Invalid email address!" };
                setErrors(emailError);
              } else {
                const ownerEmailError = { ...errors, legalOwnersEmail: "" }
                setErrors(ownerEmailError);
              }
            }}
          />
        </div>
        {errors.legalOwnersEmailAddress ? <small style={{ color: 'red' }}>{errors.legalOwnersEmailAddress}</small> : ""}
      </div>
      <div className="tc">
        <button className="b--none w4 br3 grow h2  pointer pv2 white tc "
          style={{ background: "#0fa3a3", outline: "none" }}
          onClick={e => {
            e.preventDefault();
          }}
        >
          Submit
        </button>
      </div>

    </form>
  )
}
