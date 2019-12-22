import * as React from 'react';
import { InputGroup, Icon, IconName, Intent, FormGroup } from '@blueprintjs/core';
import { isString } from 'lodash';

interface InputGroupFieldProps {
  id: string;
  className?: string | '';
  value: string;
  onChange?: (value: any) => void;
  placeHolder?: string;
  style?: any;
  leftIcon?: IconName | JSX.Element;
  leftIconColor?: string;
  validationOnBlur?: any;
  readOnly?: boolean;
  rightElement?: JSX.Element;
  type?: string; // Should be always text
  intent?: Intent;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
  keypress?: (e: any) => void
}

export const InputGroupField = (props: InputGroupFieldProps) => (
  <InputGroup
    className={props.className}
    id={props.id}
    autoFocus={props.autoFocus}
    fill={true}
    type={props.type ? props.type : 'text'}
    readOnly={props.readOnly}
    placeholder={props.placeHolder}
    style={props.style ? props.style : {}}
    leftIcon={isString(props.leftIcon) === true ?
      <Icon icon={props.leftIcon} color={props.leftIconColor ? props.leftIconColor : '#0fa3a3'} />
      : props.leftIcon
    }
    rightElement={props.rightElement ? props.rightElement : undefined}
    value={props.value}
    onChange={props.onChange}
    onBlur={props.validationOnBlur ? props.validationOnBlur : null}
    intent={props.error ? Intent.DANGER : props.intent ? props.intent : Intent.NONE}
    disabled={props.disabled}
    onKeyPress={props.keypress}
  />
);

export const InputGroupFieldWithError = (props: InputGroupFieldProps) => (
  <>
    <InputGroupField {...props} />
    {props.error &&
      <small style={{ color: "red" }}>
        {props.error}
      </small>
    }
  </>
);

interface InputGroupFieldWithLabelProps extends InputGroupFieldProps {
  label: string | JSX.Element;
  helperText?: string;
  inline?: boolean;
  required?: boolean;
}

export const InputGroupFieldWithLabel = (props: InputGroupFieldWithLabelProps) => (
  <FormGroup
    inline={props.inline}
    intent={props.error ? Intent.DANGER : Intent.NONE}
    label={<span className="f5 fw5">{props.label}</span>}
    helperText={props.error ? props.error : props.helperText}
    labelFor={props.id}
  >
    <InputGroup {...props} />
  </FormGroup>
);