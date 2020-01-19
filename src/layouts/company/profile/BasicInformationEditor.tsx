import React, { useState } from 'react';
import { isNumber, isEmpty, isEqual } from 'lodash';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { InputGroupField } from 'components/fields/InputGroupField';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import { CompanyModel } from 'stores/company/Reducer';
import { editCompanyInfoAction } from 'stores/company/Actions';


interface CompanyInfoProps {
  companyInfo: CompanyModel;
}

const CompanyInfoFormComponent = (props: {
  // should use CompanyBasicInfo interface
  editCompanyInfoAction: (val: any) => void
  setShowDialog: (val: boolean) => void
} & CompanyInfoProps) => {
  const [values, setValues] = useState({
    address: props.companyInfo.address,
    email: props.companyInfo.email,
    legalOwnerName: props.companyInfo.legalOwnerName,
    legalOwnerMail: props.companyInfo.legalOwnerMail
  });

  const [errors, setErrors] = useState({
    address: "",
    email: "",
    legalOwnerName: "",
    legalOwnerMail: ""
  });

  const emailValidation = (email: string) => {
    const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regexForEmailValidation)) {
      return true;
    } else {
      return false;
    }
  };

  const emptyErrorCheck = () => {
    if (isEmpty(errors.legalOwnerMail) && isEmpty(errors.email)) {
      return true;
    } else {
      return false;
    }
  };

  const emptyValueCheck = () => {
    if (isEmpty(values.address)) {
      let e = errors;
      if (isEmpty(values.address)) {
        e = { ...e, address: "Required" };
      }
      setErrors(e);
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (name: string | number) => (event: any) => {
    const value = isNumber(event) ? event.toString() : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const checkLegalOwnerMail = () => {
    if (isEqual(values.email, values.legalOwnerMail)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <form className="fl w-100 pa4">
      <h1 className="f5 lh-title ml2 tigrow-lightBlue mb4">Basic Information</h1>
      <div className={` ${errors.address ? "mb3" : "mb4"}`}>
        <InputGroupField
          id="address"
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
              const addressError = { ...errors, address: "Required" };
              setErrors(addressError);
            } else {
              const addressError = { ...errors, address: "" };
              setErrors(addressError);
            }
          }}
        />
        {errors.address ? <small style={{ color: 'red' }}>{errors.address}</small> : ""}
      </div>
      <div className={` ${errors.email ? "mb3" : "mb4"}`}>
        <InputGroupField
          id="email"
          value={values.email}
          onChange={handleChange("email")}
          placeHolder="Company email address"
          leftIcon="envelope"
          style={{
            boxShadow: 'none'
          }}
          className={`br0 ${errors.email ? 'bb b--red' : 'bb b--lightBlue'}`}
          leftIconColor={`${errors.email ? 'red' : "#0fa3a3"}`}
          validationOnBlur={() => {
            if (checkLegalOwnerMail() && !isEmpty(values.email)) {
              const companyEmailError = { ...errors, email: "Company email address and legal owner mail address must be different" };
              setErrors(companyEmailError);
            } else if (!emailValidation(values.email)) {
              const emailError = { ...errors, email: "Invalid email address!" };
              setErrors(emailError);
            } else {
              const emailError = { ...errors, email: "" };
              setErrors(emailError);
            }
          }}
        />
        {errors.email ? <small style={{ color: 'red' }}>{errors.email}</small> : ""}
      </div>
      <div className={` ${errors.legalOwnerName ? "mb3" : "mb4"}`}>
        <InputGroupField
          id="legalOwnerName"
          value={values.legalOwnerName}
          onChange={handleChange("legalOwnerName")}
          placeHolder="Legal Owner Name"
          leftIcon="mugshot"
          style={{
            boxShadow: 'none'
          }}
          className={`br0 ${errors.legalOwnerName ? 'bb b--red' : 'bb b--lightBlue'}`}
          leftIconColor={`${errors.legalOwnerName ? 'red' : "#0fa3a3"}`}
        />
        {errors.legalOwnerName ? <small style={{ color: 'red' }}>{errors.legalOwnerName}</small> : ""}
      </div>
      <div className={` ${errors.legalOwnerMail ? "mb3" : "mb4"}`}>
        <InputGroupField
          id="legalOwnerMail"
          value={values.legalOwnerMail}
          onChange={handleChange("legalOwnerMail")}
          placeHolder="Leagl Owner email address"
          leftIcon="envelope"
          style={{
            boxShadow: 'none'
          }}
          className={`br0 ${errors.legalOwnerMail ? 'bb b--red' : 'bb b--lightBlue'}`}
          leftIconColor={`${errors.legalOwnerMail ? 'red' : "#0fa3a3"}`}
          validationOnBlur={() => {
            if (checkLegalOwnerMail() && !isEmpty(values.legalOwnerMail)) {
              const ownerEmailError = { ...errors, legalOwnerMail: "Company email address and legal owner mail address must be different" };
              setErrors(ownerEmailError);
            } else if (!emailValidation(values.legalOwnerMail)) {
              const legalOwnerMailError = { ...errors, legalOwnerMail: "Invalid email address!" };
              setErrors(legalOwnerMailError);
            } else {
              const legalOwnerMailError = { ...errors, legalOwnerMail: "" };
              setErrors(legalOwnerMailError);
            }
          }}
        />
        {errors.legalOwnerMail ? <small style={{ color: 'red' }}>{errors.legalOwnerMail}</small> : ""}
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
            if (!emptyValueCheck() && emptyErrorCheck()) {
              props.editCompanyInfoAction(values);
              props.setShowDialog(false);
            }
          }}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companyInfo: state.companyReducer.currentCompany,
  };
};

export const CompanyInfoForm = connect(mapStateToProps, { editCompanyInfoAction })(CompanyInfoFormComponent);
