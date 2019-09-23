import * as React from 'react';
import { InputGroup, Icon, IconName, Intent } from '@blueprintjs/core';

interface InputGroupFieldProps {
  id: string;
  className?: string | '';
  value: string;
  onChange?: (value: any) => void;
  placeHolder?: string;
  style?: any;
  leftIcon?: IconName;
  leftIconColor?: string;
  validationOnBlur?: any;
  readOnly?: boolean;
  rightElement?: JSX.Element;
  type?: string;
  intent?: Intent;
}

export const InputGroupField = (props: InputGroupFieldProps) => (
  <InputGroup
    className={props.className}
    id={props.id}
    fill={true}
    type={props.type ? props.type : 'text'}
    readOnly={props.readOnly}
    placeholder={props.placeHolder}
    style={props.style ? props.style : {}}
    leftIcon={props.leftIconColor ?
      <Icon icon={props.leftIcon} color={props.leftIconColor} />
      : props.leftIcon
    }
    rightElement={props.rightElement ? props.rightElement : undefined}
    value={props.value}
    onChange={props.onChange}
    onBlur={props.validationOnBlur ? props.validationOnBlur : null}
    intent={props.intent ? props.intent : Intent.NONE}
  />
)