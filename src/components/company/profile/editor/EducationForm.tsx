import React, { useState } from 'react';
import { isNumber } from 'lodash';
import { DateInput } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { InputGroupField } from 'components/common/field/InputGroup';
import { Icon } from '@blueprintjs/core';

export const EducationFormComponent = () => {

  const [values, setValues] = useState({
    degree: "",
    institutionName: "",
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
            id="degree"
            value={values.degree}
            onChange={handleChange("degree")}
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
            value={values.institutionName}
            onChange={handleChange("institutionName")}
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
        <div className="experiencedatePicker w-100 flex ">
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
    </form>
  )
}