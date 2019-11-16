import React from 'react';
import { DateInput } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { InputGroupField } from 'components/common/field/InputGroup';
import { Icon, Checkbox, TextArea } from '@blueprintjs/core';

export const JobFormComponent = (props: any) => {
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
          />
        </div>
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
          />
        </div>
      </div>
      <div className="flex justify-around mb4">
        <div className="experiencedatePicker flex w-100">
          <Icon className='bb b--lightBlue pa1 tigrow-lightBlue' icon="calendar" />
          <DateInput
            formatDate={(date: Date) => date.toLocaleDateString()}
            parseDate={(str: string) => new Date(str)}
            placeholder={"Start Year"}
            onChange={(date: Date) => props.handleDateChange("startYear", date)}
            canClearSelection={false}
            value={props.values.startYear ? new Date(props.values.startYear) : null}
          />
        </div>
        <div className="experiencedatePicker w-100">
            <DateInput
              formatDate={(date: Date) => date.toLocaleDateString()}
              parseDate={(str: string) => new Date(str)}
              placeholder={"End Year"}
              onChange={(date: Date) => props.handleDateChange("endingYear", date)}
              disabled={props.checked}
              minDate={props.minEndYear}
              canClearSelection={false}
              value={props.values.endingYear ? new Date(props.values.endingYear) : null }
            /> 
          
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
        <Checkbox
          checked={props.checked}
          onChange={props.handleCheck}
          label="I currently work here"
        />
      </div>
    </form>
  )
}