import React, { useState } from 'react'
import { isEmpty, isNumber } from 'lodash';
import { connect } from 'react-redux';
import { editUserInfoAction } from 'stores/user/Actions';
import { NumericInput, Button, RadioGroup, Radio, HTMLSelect, Icon } from '@blueprintjs/core';
import { InputGroupField } from 'components/common/field/InputGroup';
import { User } from 'stores/user/Reducer';
import { DateInput } from '@blueprintjs/datetime';
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { isEqual } from 'lodash';

interface BasicInfoProps {
  userInfo: User
}

const Blood = [
  'A+',
  'A-',
  'O+',
  'O-',
  'AB+',
  'AB-',
  'B+',
  'B-'
]

const BasicInfoFormComponent = (props: {
  editInfoAction: (val: any) => void
  setShowDialog: (val: boolean) => void
} & BasicInfoProps) => {

  const [values, setValues] = useState({
    email: props.userInfo.email,
    secondaryEmail: props.userInfo.secondaryEmail,
    contactNo: props.userInfo.contactNo,
    location: props.userInfo.location,
    gender: props.userInfo.gender,
    birthDate: props.userInfo.birthDate,
    bloodGroup: props.userInfo.bloodGroup
  });

  const [errors, setErrors] = useState({
    secondaryEmail: "",
    contactNo: ""
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
    <form className="fl w-100 pa4">
      <h1 className="f5 lh-title ml2 tigrow-lightBlue mb4">Basic Information</h1>
      <div className="mb4">
        <InputGroupField
          id="email"
          value={values.email}
          leftIcon="envelope"
          style={{
            boxShadow: 'none'
          }}
          className="bb b--lightBlue"
          leftIconColor="#0fa3a3"
          readOnly={true}
        />
      </div>
      <div className={` ${errors.secondaryEmail ? "mb3" : "mb4"}`}>
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
        {errors.secondaryEmail ? <small style={{ color: 'red' }}>{errors.secondaryEmail}</small> : ""}
      </div>
      <div className={`flex justify-content ${errors.contactNo ? "mb3" : "mb4"}`}>
        <div className=" w-20 ">
          <InputGroupField
            id="contactNo"
            value="+880"
            leftIcon="phone"
            className={`br0 ${errors.contactNo ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.contactNo ? 'red' : "#0fa3a3"}`}
            style={{
              boxShadow: 'none',
            }}
            readOnly={true}
          />
        </div>
        <div className="ml3 flex-auto">
          <div className=" w-100">
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
                }else if (values.contactNo.length !== 10) {
                  const contactNoError = { ...errors, contactNo: "Not more or less than 10 character" };
                  setErrors(contactNoError);
                }
                else {
                  const contactNoError = { ...errors, contactNo: "" };
                  setErrors(contactNoError);
                }
              }}
            />
          </div>
          {errors.contactNo ? <small style={{ color: 'red' }}>{errors.contactNo}</small> : ""}
        </div>
      </div>
      <div className="mb4">
        <InputGroupField
          id="address"
          value={values.location}
          onChange={handleChange("location")}
          placeHolder="Address"
          leftIcon="map-marker"
          style={{
            boxShadow: 'none'
          }}
          className="bb b--lightBlue"
          leftIconColor="#0fa3a3"
        />
      </div>
      <div className="mb4">
        <div className="flex">
          <div className=" f5 pa1 bb b--lightBlue">
            <Icon
              icon="tint"
              className="tigrow-lightBlue"
            />
          </div>
          <HTMLSelect
            fill={true}
            minimal={true}
            onChange={(event: any) => {
              const value = event.currentTarget.value;
              setValues({ ...values, bloodGroup: value });
            }}
            className=" bb b--lightBlue"
            style={{
              boxShadow: 'none',
              borderRadius: '0px',
              backgroundColor: 'white',
              flex: '1',
              outline: 'none'
            }}
          >
            <option selected value=''>{`${values.bloodGroup ? values.bloodGroup : "Please select your blood group"}`}</option>
            {Blood.map(blood => (
              <option value={blood}>{blood}</option>
            ))}
          </HTMLSelect>
        </div>
      </div>
      <div className="birthdatePicker flex w-100 mb4">
        <Icon className='bb b--lightBlue pa1 tigrow-lightBlue' icon="calendar" />
        <DateInput
          formatDate={(date: Date) => date.toLocaleDateString()}
          parseDate={(str: string) => new Date(str)}
          onChange={(date: Date) => {
            setValues({
              ...values, birthDate: date
            });
          }}
          value={new Date(values.birthDate)}
          popoverProps={{
            targetClassName: 'w-100'
          }}
        />
      </div>
      <div className="mb4">
        <RadioGroup
          label="Gender"
          onChange={(event: any) => {
            const value = event.currentTarget.value;
            setValues({ ...values, gender: value });
          }}
          inline={true}
          className="tigrow-lightBlue outline-0"
          selectedValue={values.gender}
        >
          <Radio label="Female"
            value="female"
            className={`${isEqual(values.gender, "female") ? ':checked' : ''}`}
          />
          <Radio label="Male"
            value="male"
            className={`${isEqual(values.gender, "male") ? ':checked' : ''}`}
          />
          <Radio label="Others"
            value="others"
            className={`${isEqual(values.gender, "others") ? ':checked' : ''}`}
          />
        </RadioGroup>
      </div>
      <div className="flex justify-end">
        <Button className="w4 grow h2 pointer mr3"
          style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3" }}
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
            if (!emptyValueCheck()) {
              props.editInfoAction(values);
              props.setShowDialog(false);
            }
          }}
        >
          Save
        </Button>
      </div>
    </form>
  )
}

const mapStateToProps = (state: any) => {
  return {
    userInfo: state.userReducer.user
  }
}

export const BasicInfoForm = connect(mapStateToProps, { editInfoAction: editUserInfoAction })(BasicInfoFormComponent);
