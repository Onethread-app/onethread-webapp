import React, { useState } from 'react'
import { InputGroupField } from 'components/common/InputGroup';
import { isEmpty, isNumber } from 'lodash';
import { connect } from 'react-redux';
import { editInfoAction } from 'actions/InfoActions';
import { NumericInput } from '@blueprintjs/core';


const BasicInfoFormComponent = (props: {
  editInfoAction: (val: any) => void
}) => {
  const [values, setValues] = useState({
    email: "",
    secondaryEmail: "",
    contactNo: "",
    address: "",
    gender: "",
    birthDate: "",
    bloodGroup: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    secondaryEmail: "",
    contactNo: "",
    address: "",
    gender: "",
    birthDate: "",
    bloodGroup: ""
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
    if (isEmpty(values.contactNo)) {
      let e = errors;
      if (isEmpty(values.contactNo)) {
        e = { ...e, contactNo: "Required" };
      }
      setErrors(e);
      return true;
    } else {
      return false;
    }
  }

  const handleChange = (name: string | number) => (event: any) => {
    const value = isNumber(event) ? event.toString() : event.target.value;
    setValues({ ...values, [name]: value });
  };

  return (
    <form className="fl w-100 pa2">
      <div className={` ${errors.secondaryEmail ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="secondaryEmail"
            value={values.secondaryEmail}
            onChange={handleChange("secondaryEmail")}
            placeHolder="Secondary Email Address"
            leftIcon="envelope"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.secondaryEmail ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.secondaryEmail ? 'red' : "#0fa3a3"}`}
            validationOnBlur={() => {
              if (!emailValidation(values.secondaryEmail)) {
                const secondaryEmailError = { ...errors, secondaryEmail: "Invalid email address!" };
                setErrors(secondaryEmailError);
              } else {
                const secondaryEmailError = { ...errors, secondaryEmail: "" };
                setErrors(secondaryEmailError);
              }
            }}
          />
        </div>
        {errors.secondaryEmail ? <small style={{ color: 'red' }}>{errors.secondaryEmail}</small> : ""}
      </div>

      <div className="mb4">
        <NumericInput
          className={`br0 ${errors.contactNo ? 'bb b--red' : 'bb b--lightBlue'} w-100`}
          style={{
            boxShadow: 'none',
          }}
          fill={true}
          placeholder="e.g. 1789442325"
          value={values.contactNo}
          onValueChange={handleChange("contactNo")}
          buttonPosition="none"
          onBlur={() => {
            if (isEmpty(values.contactNo)) {
              const contactNoError = { ...errors, contactNo: "Required" };
              setErrors(contactNoError);
            } else if (values.contactNo.length !== 10) {
              const contactNoError = { ...errors, contactNo: "Not more or less than 10 character" };
              setErrors(contactNoError);
            }
            else {
              const contactNoError = { ...errors, contactNo: "" };
              setErrors(contactNoError);
            }
          }}
        />
        {errors.contactNo ? <small className="red">{errors.contactNo}</small> : ""}
      </div>
      <div className="mb4">
        <div className="flex">
          <InputGroupField
            id="address"
            value={values.address}
            onChange={handleChange("address")}
            placeHolder="Address"
            leftIcon="briefcase"
            style={{
              boxShadow: 'none'
            }}
            className="bb b--lightBlue"
            leftIconColor="#0fa3a3"
          />
        </div>
      </div>
      <div className="mb4">
        <div className="flex">
          <InputGroupField
            id="birthDate"
            value={values.bloodGroup}
            onChange={handleChange("bloodGroup")}
            placeHolder="Blood Group"
            leftIcon="briefcase"
            style={{
              boxShadow: 'none'
            }}
            className="bb b--lightBlue"
            leftIconColor="#0fa3a3"
          />
        </div>
      </div>
      <div className="tc">
        <button className="b--none w4 br3 grow h2  pointer pv2 white tc "
          style={{ background: "#0fa3a3", outline: "none" }}
          onClick={e => {
            e.preventDefault();
            if (!emptyValueCheck()) {
              props.editInfoAction(values);
            }
          }}
        >
          Submit
        </button>
      </div>

    </form>
  )
}

const mapStateToProps = (state: any) => {
  return {
    users: state.info.user
  }
}


export const BasicInfoForm = connect(mapStateToProps, { editInfoAction })(BasicInfoFormComponent);
