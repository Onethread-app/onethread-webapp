import React, { useState } from 'react';
import { isNumber } from 'lodash';
import { DateInput } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { InputGroupField } from 'components/common/field/InputGroup';
import { Icon, Checkbox} from '@blueprintjs/core';

export const JobFormComponent = () => {

  const [values, setValues] = useState({
    companyName: "",
    positionName: "",
    startYear: "",
    endYear: ""
  });

  const handleChange = (name: string | number) => (event: any) => {
    const value = isNumber(event) ? event.toString() : event.target.value;
    setValues({ ...values, [name]: value });
  };

  return (
    <form className="fl w-100 pr4 mt2">
      <div className="mb4 ">
        <div className="flex">
          <InputGroupField
            id="companyName"
            value={values.companyName}
            onChange={handleChange("companyName")}
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
            value={values.positionName}
            onChange={handleChange("positionName")}
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
          />
        </div>
        <div className="experiencedatePicker w-100">
          <DateInput
            formatDate={(date: Date) => date.toLocaleDateString()}
            parseDate={(str: string) => new Date(str)}
            placeholder={"End Year"}
          />
        </div>
      </div>
      <div className="mb4">
        <Checkbox label="I currently work here"  />
      </div>
    </form>
  )
}