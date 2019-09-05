import * as React from 'react';
import { InputGroup, Icon, IconName } from '@blueprintjs/core';

interface InputGroupFieldProps {
  value: string;
  onChange?: (value: any) => void;
  placeHolder: string;
  style?: any;
  leftIcon?: IconName;
  leftIconColor?: string;
  validationOnBlur?: any;
}

export const InputGroupField = (props: InputGroupFieldProps) => (
  <InputGroup
    id={props.value}
    fill={true}
    placeholder={props.placeHolder}
    style={props.style ? props.style : {}}
    leftIcon={props.leftIconColor ?
      <Icon icon={props.leftIcon} color={props.leftIconColor} />
      : props.leftIcon
    }
    value={props.value}
    onChange={props.onChange}
    onBlur={props.validationOnBlur ? props.validationOnBlur : null}
  />
)