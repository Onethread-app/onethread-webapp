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
  className?: string;
}

interface DropdownFieldWithLabelProps extends DropdownFieldProps {
  label: string | JSX.Element;
  helperText?: string;
  inline?: boolean;
  required?: boolean;
}

export const DropdownField = (props: DropdownFieldProps) => (
  <div>
    <HTMLSelect
      id={props.id}
      fill={true}
      minimal={true}
      onChange={props.onChange}
      style={{
        boxShadow: 'none',
        backgroundColor: 'white',
        flex: '1',
        outline: 'none'
      }}
    >
      <option selected value=""></option>
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
    label={<p className="fw5" style={{ fontSize: '.8rem' }}>{props.label}</p>}
    helperText={props.error ? props.error : props.helperText}
    labelFor={props.id}
  >
    <DropdownField {...props} />
  </FormGroup>
);