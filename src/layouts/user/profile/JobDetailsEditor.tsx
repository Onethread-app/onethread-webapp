import React, { useState, useEffect } from 'react';
import { DateInput } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { InputGroupField } from 'components/fields/InputGroupField';
import { Icon, Checkbox, TextArea } from '@blueprintjs/core';
import { isEmpty } from 'lodash';

export const JobFormComponent = (props: any) => {
  const [errors, setErrors] = useState({
    companyName: "",
    positionName: "",
    startYear: "",
    endingYear: "",
    currentlyWork: ""
  });

  useEffect(() => {
    props.errors.companyName = "";
    props.errors.positionName = "";
    props.errors.startYear = "";
    props.errors.endingYear = "";
    props.errors.currentlyWork = "";
  })

  return (
    <form className="fl w-100 pr4 mt2">
      <div className="mb4 ">
        <div className="flex">
          <InputGroupField
            id="companyName"
            value={props.values.companyName}
            onChange={props.handleChange("companyName")}
            placeHolder="Company Name"
            leftIcon="id-number"
            style={{
              boxShadow: 'none'
            }}
            className='bb b--lightBlue'
            leftIconColor="#0fa3a3"
            validationOnBlur={() => {
              if (isEmpty(props.values.companyName)) {
                const companyNameError = { ...errors, companyName: "Required" };
                setErrors(companyNameError);
              } else {
                const companyNameError = { ...errors, companyName: "" };
                setErrors(companyNameError);
              }
            }}
          />
        </div>
        {(errors.companyName || props.errors.companyName) &&
          <small style={{ color: 'red' }}>Required</small>}
      </div>
      <div className="mb4">
        <div className="flex">
          <InputGroupField
            id="positionName"
            value={props.values.positionName}
            onChange={props.handleChange("positionName")}
            placeHolder="Position Name"
            leftIcon="id-number"
            style={{
              boxShadow: 'none'
            }}
            className='bb b--lightBlue'
            leftIconColor="#0fa3a3"
            validationOnBlur={() => {
              if (isEmpty(props.values.positionName)) {
                const positionNameError = { ...errors, positionName: "Required" };
                setErrors(positionNameError);
              } else {
                const positionNameError = { ...errors, positionName: "" };
                setErrors(positionNameError);
              }
            }}
          />
        </div>
        {(errors.positionName || props.errors.positionName) &&
          <small style={{ color: 'red' }}>Required</small>}
      </div>
      <div className="flex justify-between mb4">
        <div className="experiencedatePicker w-100">
          <div className="flex">
            <Icon className='bb b--lightBlue pa1 tigrow-lightBlue' icon="calendar" />
            <DateInput
              formatDate={(date: Date) => date.toLocaleDateString()}
              parseDate={(str: string) => new Date(str)}
              onChange={(date: Date) =>
                props.handleDateChange("startYear", date)}
              placeholder={"Start Year"}
              canClearSelection={false}
              value={props.values.startYear ? new Date(props.values.startYear) : null}
              popoverProps={{
                targetClassName: 'w-100'
              }}
              minDate={new Date("1800/01/01")}
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
              disabled={new Date(props.values.startYear).getDate() === new Date().getDate() || props.values.startYear === "" ? true : props.checked}
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
          style={{ resize: "none" }}
          fill={true}
          growVertically={true}
          onChange={props.handleChange("jobDescription")}
          value={props.values.jobDescription}
        />
      </div>
      <div className="mb4">
        <div>

          <Checkbox
            checked={props.checked}
            onChange={props.handleCheck}
            label="I currently work here"
            disabled={props.values.startYear === "" ? true : false}
          />
        </div>
        {(errors.currentlyWork || props.errors.currentlyWork) &&
          <small style={{ color: 'red' }}>Required</small>}
      </div>
    </form>
  )
}