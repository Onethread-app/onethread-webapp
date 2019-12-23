import React, { useState, useEffect } from 'react';
import { DateInput } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { InputGroupField } from 'components/fields/InputGroupField';
import { Icon, Checkbox, TextArea } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';

export const EducationFormComponent = (props: any) => {
  const [errors, setErrors] = useState({
    degree: "",
    institutionName: "",
    startYear: "",
    endingYear: "",
    currentlyStudy: ""
  });

  useEffect(() => {
    props.errors.degree = "";
    props.errors.institutionName = "";
    props.errors.startYear = "";
    props.errors.endingYear = "";
    props.errors.currentlyStudy = "";
  })

  const birthDate = useSelector((state: any) => state.userReducer.user.birthDate);

  return (
    <form className="fl w-100 pr4 mt2">
      <div className="mb4 ">
        <div className="flex">
          <InputGroupField
            id="degree"
            value={props.values.degree}
            onChange={props.handleChange("degree")}
            placeHolder="Degree"
            leftIcon="crown"
            style={{
              boxShadow: 'none'
            }}
            className='bb b--lightBlue'
            leftIconColor="#0fa3a3"
            validationOnBlur={() => {
              if (isEmpty(props.values.degree)) {
                const degreeError = { ...errors, degree: "Required" };
                setErrors(degreeError);
              } else {
                const degreeError = { ...errors, degree: "" };
                setErrors(degreeError);
              }
            }}
          />
        </div>
        {(errors.degree || props.errors.degree) &&
          <small style={{ color: 'red' }}>Required</small>}
      </div>
      <div className="mb4">
        <div className="flex">
          <InputGroupField
            id="institutionName"
            value={props.values.institutionName}
            onChange={props.handleChange("institutionName")}
            placeHolder="Institution Name"
            leftIcon="office"
            style={{
              boxShadow: 'none'
            }}
            className='bb b--lightBlue'
            leftIconColor="#0fa3a3"
            validationOnBlur={() => {
              if (isEmpty(props.values.institutionName)) {
                const institutionNameError = { ...errors, institutionName: "Required" };
                setErrors(institutionNameError);
              } else {
                const institutionNameError = { ...errors, institutionName: "" };
                setErrors(institutionNameError);
              }
            }}
          />
        </div>
        {(errors.institutionName || props.errors.institutionName) &&
          <small style={{ color: 'red' }}>Required</small>}
      </div>
      <div className="flex justify-around mb4">
        <div className="experiencedatePicker w-100">
          <div className="flex">
            <Icon className='bb b--lightBlue pa1 tigrow-lightBlue' icon="calendar" />
            <DateInput
              formatDate={(date: Date) => date.toLocaleDateString()}
              parseDate={(str: string) => new Date(str)}
              placeholder={"Start Year"}
              onChange={(date: Date) => props.handleDateChange("startYear", date)}
              canClearSelection={false}
              value={props.values.startYear ? new Date(props.values.startYear) : null}
              popoverProps={{
                targetClassName: 'w-100'
              }}
              minDate={new Date(birthDate)}
              maxDate={props.values.endingYear ? new Date(props.values.endingYear) : new Date()}
            />
          </div>
          {(errors.startYear || props.errors.startYear) &&
            <small style={{ color: 'red' }}>Required</small>}
        </div>
        <div className="experiencedatePicker w-100">
          <div>
            <DateInput
              formatDate={(date: Date) => date.toLocaleDateString()}
              parseDate={(str: string) => new Date(str)}
              placeholder={"End Year"}
              onChange={(date: Date) => props.handleDateChange("endingYear", date)}
              disabled={new Date(props.values.startYear).toLocaleDateString() === new Date().toLocaleDateString() || props.values.startYear === "" ? true : props.checked}
              minDate={props.minEndYear}
              canClearSelection={false}
              value={props.values.endingYear ? new Date(props.values.endingYear) : null}
              maxDate={new Date()}
              popoverProps={{
                targetClassName: 'w-100'
              }}
            />
          </div>
          {(errors.endingYear || props.errors.endingYear) &&
            <small style={{ color: 'red' }}>Required</small>}
        </div>
      </div>
      <div className="mb4">
        <TextArea
          style={{ resize: "none", minHeight: "50px" }}
          fill={true}
          growVertically={true}
          onChange={props.handleChange("eduDescription")}
          value={props.values.eduDescription}
        />
      </div>
      <div className="mb4">
        <div>
          <Checkbox
            checked={props.checked}
            onChange={props.handleCheck}
            disabled={ props.values.startYear === "" ? true : false}
            label="I currently study here"
          />
        </div>
        {(errors.currentlyStudy || props.errors.currentlyStudy) &&
          <small style={{ color: 'red' }}>Required</small>}
      </div>
    </form>
  )
}