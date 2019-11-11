import React from 'react';
import { DateInput } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { InputGroupField } from 'components/common/field/InputGroup';
import { Icon, Checkbox } from '@blueprintjs/core';

export const EducationFormComponent = (props: any) => {

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
          />
        </div>
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
          />
        </div>
      </div>
      <div className="flex justify-around mb4">
        <div className="experiencedatePicker w-100 flex">
          <Icon className='bb b--lightBlue pa1 tigrow-lightBlue' icon="calendar" />
          <DateInput
            formatDate={(date: Date) => date.toLocaleDateString()}
            parseDate={(str: string) => new Date(str)}
            placeholder={"Start Year"}
            onChange={(date: Date) => props.handleDateChange("startYear", date)}
            canClearSelection={false}
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
          />
        </div>
      </div>
      <div className="mb4">
        <Checkbox checked={props.checked} onChange={props.handleCheck} label="I currently study here" />
      </div>
    </form>
  )
}