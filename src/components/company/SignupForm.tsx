import React, { useState } from 'react'
import { InputGroupField } from 'components/common/field/InputGroup';
import { isEmpty } from 'lodash';
import { HTMLSelect, Icon, Button } from '@blueprintjs/core';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { createCompanyAction } from 'actions/CompanyActions';
import { History } from 'history';

const Type = [
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
    name: "",
    email: "",
    legalOwnerName: "",
    legalOwnerMail: "",
    address: "",
    type: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    legalOwnerName: "",
    legalOwnerMail: "",
    address: "",
    type: ""
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
    if (isEmpty(values.name) || isEmpty(values.email) || isEmpty(values.legalOwnerName) || isEmpty(values.legalOwnerMail) || isEmpty(values.address)) {
      let e = errors;
      if (isEmpty(values.name)) {
        e = { ...e, name: "Required" };
      }
      if (isEmpty(values.email)) {
        e = { ...e, email: "Required" };
      }
      if (isEmpty(values.legalOwnerName)) {
        e = { ...e, legalOwnerName: "Required" };
      }
      if (isEmpty(values.legalOwnerMail)) {
        e = { ...e, legalOwnerMail: "Required" };
      }
      if (isEmpty(values.address)) {
        e = { ...e, address: "Required" };
      }
      if (isEmpty(values.type)) {
        e = { ...e, type: "Required" };
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
      <div className={` ${errors.name ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="companyName"
            value={values.name}
            onChange={handleChange("name")}
            placeHolder="Company Name"
            leftIcon="briefcase"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.name ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.name ? 'red' : "#0fa3a3"}`}
            validationOnBlur={() => {
              if (isEmpty(values.name)) {
                const companyNameError = { ...errors, name: "Please enter company name" };
                setErrors(companyNameError);
              } else {
                const companyNameError = { ...errors, name: "" }
                setErrors(companyNameError);
              }
            }}
          />
        </div>
        {errors.name ? <small style={{ color: 'red' }}>{errors.name}</small> : ""}
      </div>
      <div className={` ${errors.address ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="companyAddress"
            value={values.address}
            onChange={handleChange("address")}
            placeHolder="Company Address"
            leftIcon="map-marker"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.address ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.address ? 'red' : "#0fa3a3"}`}
            validationOnBlur={() => {
              if (isEmpty(values.address)) {
                const companyAddressError = { ...errors, address: "Please enter company name" };
                setErrors(companyAddressError);
              } else {
                const companyAddressError = { ...errors, address: "" }
                setErrors(companyAddressError);
              }
            }}
          />
        </div>
        {errors.address ? <small style={{ color: 'red' }}>{errors.address}</small> : ""}
      </div>

      <div className={` ${errors.type ? "mb3" : "mb4"}`}>
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
            onChange={onChangeSelectField('type')}
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
            {Type.map(t => (
              <option value={t}>{t}</option>
            ))}
          </HTMLSelect>
        </div>
        {errors.type ? <small style={{ color: 'red' }}>{errors.type}</small> : ""}
      </div>

      <div className={` ${errors.email ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="companyMail"
            value={values.email}
            onChange={handleChange("email")}
            placeHolder="Company Email Address"
            leftIcon="envelope"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.email ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.email ? 'red' : "#0fa3a3"}`}
            validationOnBlur={() => {
              if (isEmpty(values.email)) {
                const companyEmailError = { ...errors, email: "Please enter company email" };
                setErrors(companyEmailError);
              } else if (!emailValidation(values.email)) {
                const companyEmailError = { ...errors, email: "Invalid email address!" };
                setErrors(companyEmailError);
              } else {
                const companyEmailError = { ...errors, email: "" };
                setErrors(companyEmailError);
              }
            }}
          />
        </div>
        {errors.email ? <small style={{ color: 'red' }}>{errors.email}</small> : ""}
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
