import * as React from 'react';
import { HTMLSelect, IconName, FormGroup, Intent } from '@blueprintjs/core';
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

interface DropdownFieldWithLabelProps extends DropdownFieldProps {
  label: string | JSX.Element;
  helperText?: string;
  inline?: boolean;
  required?: boolean;
}

export const DropdownField = (props: DropdownFieldProps) => (
  <div className="flex">
    {/* <div className={`f5 pa1 bb bw1 ${props.error ? 'b--red' : 'b--lightBlue'}`}>
      <Icon
        icon={props.leftIcon ? props.leftIcon : 'briefcase'}
        color={props.error ? 'red' : props.leftIconColor ? `${props.leftIconColor}` : '#0fa3a3'}
      />
    </div> */}
    <HTMLSelect
      id={props.id}
      fill={true}
      minimal={true}
      onChange={props.onChange}
      // className={`bw1 ${props.error ? 'bb b--red' : 'bb b--lightBlue'}`}
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
      <small style={{ color: 'red' }}>
        {props.error}
      </small>
    }
  </>
);

export const DropdownFieldErrorWithLabel = (props: DropdownFieldWithLabelProps) => (
  <FormGroup
    inline={props.inline}
    intent={props.error ? Intent.DANGER : Intent.NONE}
    label={<span className="f5 fw5">{props.label}</span>}
    helperText={props.error ? props.error : props.helperText}
    labelFor={props.id}
  >
    <DropdownField {...props} />
  </FormGroup>
);