import React, { useState } from 'react'
import { InputGroupField } from 'components/common/field/InputGroup';
import { isEmpty } from 'lodash';
import { HTMLSelect, Icon, Button } from '@blueprintjs/core';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { createCompanyAction } from 'actions/CompanyActions';
import { History } from 'history';

const companyType = [
  'Manufacturer',
  'Trading Company',
  'Buying Office',
  'Agent',
  'Distributor/Wholesaler',
  'Government ministry/Bureau/Commission',
  'Association',
  'Business Service (Transportation, finance, travel, Ads, etc)',
  'Other',
]

const CompanySignupFormComponent = (props: {
  setShowDialog: (val: boolean) => void;
  createCompanyAction: (val: any, history: History) => void
} & RouteComponentProps) => {
  const [values, setValues] = useState({
    companyName: "",
    companyMail: "",
    legalOwnerName: "",
    legalOwnerMail: "",
    companyAddress: "",
    companyType: ""
  });

  const [errors, setErrors] = useState({
    companyName: "",
    companyMail: "",
    legalOwnerName: "",
    legalOwnerMail: "",
    companyAddress: "",
    companyType: ""
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
    if (isEmpty(values.companyName) || isEmpty(values.companyMail) || isEmpty(values.legalOwnerName) || isEmpty(values.legalOwnerMail) || isEmpty(values.companyAddress)) {
      let e = errors;
      if (isEmpty(values.companyName)) {
        e = { ...e, companyName: "Required" };
      }
      if (isEmpty(values.companyMail)) {
        e = { ...e, companyMail: "Required" };
      }
      if (isEmpty(values.legalOwnerName)) {
        e = { ...e, legalOwnerName: "Required" };
      }
      if (isEmpty(values.legalOwnerMail)) {
        e = { ...e, legalOwnerMail: "Required" };
      }
      if (isEmpty(values.companyAddress)) {
        e = { ...e, companyAddress: "Required" };
      }
      if (isEmpty(values.companyType)) {
        e = { ...e, companyType: "Required" };
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

  const onChangeSelectField = (name: string) => (event: any) => {
    const value = event.currentTarget.value;
    setValues({ ...values, [name]: value });
    setErrors({...errors, [name]: ""})
  }

  return (
    <form className="fl w-100 pa2" >
      <div className={` ${errors.companyName ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="companyName"
            value={values.companyName}
            onChange={handleChange("companyName")}
            placeHolder="Company Name"
            leftIcon="briefcase"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.companyName ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.companyName ? 'red' : "#0fa3a3"}`}
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
      <div className={` ${errors.companyAddress ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="companyAddress"
            value={values.companyAddress}
            onChange={handleChange("companyAddress")}
            placeHolder="Company Address"
            leftIcon="map-marker"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.companyAddress ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.companyAddress ? 'red' : "#0fa3a3"}`}
            validationOnBlur={() => {
              if (isEmpty(values.companyAddress)) {
                const companyAddressError = { ...errors, companyAddress: "Please enter company name" };
                setErrors(companyAddressError);
              } else {
                const companyAddressError = { ...errors, companyAddress: "" }
                setErrors(companyAddressError);
              }
            }}
          />
        </div>
        {errors.companyAddress ? <small style={{ color: 'red' }}>{errors.companyAddress}</small> : ""}
      </div>

      <div className={` ${errors.companyType ? "mb3" : "mb4"}`}>
        <div className="flex">
          <div className=" f5 pa1 bb b--lightBlue">
            <Icon
              icon={"briefcase"}
              className="tigrow-lightBlue"
            />
          </div>
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
            <option selected value=''>Please select a company type</option>
            {companyType.map(t => (
              <option value={t}>{t}</option>
            ))}
          </HTMLSelect>
        </div>
        {errors.companyType ? <small style={{ color: 'red' }}>{errors.companyType}</small> : ""}
      </div>

      <div className={` ${errors.companyMail ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="companyMail"
            value={values.companyMail}
            onChange={handleChange("companyMail")}
            placeHolder="Company Email Address"
            leftIcon="envelope"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.companyMail ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.companyMail ? 'red' : "#0fa3a3"}`}
            validationOnBlur={() => {
              if (isEmpty(values.companyMail)) {
                const companyEmailError = { ...errors, companyMail: "Please enter company email" };
                setErrors(companyEmailError);
              } else if (!emailValidation(values.companyMail)) {
                const companyEmailError = { ...errors, companyMail: "Invalid email address!" };
                setErrors(companyEmailError);
              } else {
                const companyEmailError = { ...errors, companyMail: "" };
                setErrors(companyEmailError);
              }
            }}
          />
        </div>
        {errors.companyMail ? <small style={{ color: 'red' }}>{errors.companyMail}</small> : ""}
      </div>

      <div className={` ${errors.legalOwnerName ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="legalOwnerName"
            value={values.legalOwnerName}
            onChange={handleChange("legalOwnerName")}
            placeHolder="Legal Owner's Name"
            leftIcon="mugshot"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.legalOwnerName ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.legalOwnerName ? 'red' : "#0fa3a3"}`}
            validationOnBlur={() => {
              if (isEmpty(values.legalOwnerName)) {
                const ownerNameError = { ...errors, legalOwnerName: "Please enter legal owner's name" };
                setErrors(ownerNameError);
              } else {
                const ownerNameError = { ...errors, legalOwnerName: "" }
                setErrors(ownerNameError);
              }
            }}
          />
        </div>
        {errors.legalOwnerName ? <small style={{ color: 'red' }}>{errors.legalOwnerName}</small> : ""}
      </div>

      <div className={` ${errors.legalOwnerMail ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="legalOwnerMail"
            value={values.legalOwnerMail}
            onChange={handleChange("legalOwnerMail")}
            placeHolder="Legal Owner's Email Address"
            leftIcon="envelope"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.legalOwnerMail ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.legalOwnerMail ? 'red' : "#0fa3a3"}`}
            validationOnBlur={() => {
              if (isEmpty(values.legalOwnerMail)) {
                const ownerEmailError = { ...errors, legalOwnerMail: "Please enter legal owner's email address" };
                setErrors(ownerEmailError);
              } else if (!emailValidation(values.legalOwnerMail)) {
                const ownerEmailError = { ...errors, legalOwnerMail: "Invalid email address!" };
                setErrors(ownerEmailError);
              } else {
                const ownerEmailError = { ...errors, legalOwnerMail: "" }
                setErrors(ownerEmailError);
              }
            }}
          />
        </div>
        {errors.legalOwnerMail ? <small style={{ color: 'red' }}>{errors.legalOwnerMail}</small> : ""}
      </div>
      <div className="tc">
        <Button className="b--none w4 br3 grow h2  pointer pv2 white tc"
          style={{ background: "#0fa3a3", outline: "none" }}
          onClick={(e:any) => {
            e.preventDefault();
            if (!emptyValueCheck()) {
              props.createCompanyAction(values, props.history);
              props.setShowDialog(false);
            }
          }}
        >
          Submit
        </Button>
      </div>

    </form>
  )
}


export const CompanySignupForm = connect(null, { createCompanyAction })(withRouter(CompanySignupFormComponent));
