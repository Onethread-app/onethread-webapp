import * as React from 'react';
import { Icon, HTMLSelect, IconName } from '@blueprintjs/core';
import { Entity } from 'stores/UtilsActions';
import { isEqual } from 'lodash';

interface DropdownFieldProps {
  id: string;
  selectedValue: string;
  options: Entity[];
  onChange: (value: any) => void;
  leftIcon?: IconName;
  leftIconColor?: string;
  error?: string;
}

export const DropdownField = (props: DropdownFieldProps) => (
  <div className="flex">
    <div className={`f5 pa1 bb ${props.error ? 'b--red' : 'b--lightBlue'}`}>
      <Icon
        icon={props.leftIcon ? props.leftIcon : 'briefcase'}
        color={props.error ? 'red' : props.leftIconColor ? `${props.leftIconColor}` : '#0fa3a3'}
      />
    </div>
    <HTMLSelect
      id={props.id}
      fill={true}
      minimal={true}
      onChange={props.onChange}
      className={props.error ? 'bb b--red' : 'bb b--lightBlue'}
      style={{
        boxShadow: 'none',
        borderRadius: '0px',
        backgroundColor: 'white',
        flex: '1',
        outline: 'none'
      }}
    >
      <option selected value=''>Please select a value</option>
      {props.options.map(opt => (
        <option 
          value={opt._id}
          selected={isEqual(opt._id, props.selectedValue) === true}
        >
          {opt.name}
        </option>
      ))}
    </HTMLSelect>
  </div>
);

export const DropdownFieldWithError = (props: DropdownFieldProps) => (
  <>
    <DropdownField {...props} />
    {props.error &&
      <small style={{ color: "red" }}>
        {props.error}
      </small>
    }
  </>
);