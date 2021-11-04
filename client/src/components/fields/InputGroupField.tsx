import { isString } from 'lodash';

import {
  Icon,
  IconName,
} from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Intent } from '@blueprintjs/core/lib/esm/common/intent';
import { InputGroup } from '@blueprintjs/core/lib/esm/components/forms/inputGroup';
import { FormGroup } from '@blueprintjs/core/lib/esm/components/forms/formGroup';

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
  keypress?: (e: any) => void;
  variant?: string;
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
    leftIcon={
      isString(props.leftIcon) === true ? (
        <Icon
          icon={props.leftIcon}
          color={
            props.leftIconColor ? props.leftIconColor : '#34b3e9'
          }
        />
      ) : (
        props.leftIcon
      )
    }
    rightElement={props.rightElement ? props.rightElement : undefined}
    value={props.value}
    onChange={props.onChange}
    onBlur={props.validationOnBlur ? props.validationOnBlur : null}
    intent={
      props.error
        ? Intent.DANGER
        : props.intent
        ? props.intent
        : Intent.NONE
    }
    disabled={props.disabled}
    onKeyPress={props.keypress}
  />
);

export const InputGroupFieldWithError = (
  props: InputGroupFieldProps,
) => (
  <>
    <InputGroupField {...props} />
    {props.error && (
      <small className="mv3" style={{ color: 'red' }}>
        {props.error}
      </small>
    )}
  </>
);

interface InputGroupFieldWithLabelProps extends InputGroupFieldProps {
  label: string | JSX.Element;
  helperText?: string;
  inline?: boolean;
  required?: boolean;
  labelClassName?: string;
}

export const InputGroupFieldWithLabel = (
  props: InputGroupFieldWithLabelProps,
) => (
  <FormGroup
    inline={props.inline}
    intent={props.error ? Intent.DANGER : Intent.NONE}
    label={
      <div
        className={`fw5 ${props.labelClassName}`}
        style={{ fontSize: '.8rem' }}
      >
        {props.label}
      </div>
    }
    helperText={props.error ? props.error : props.helperText}
    labelFor={props.id}
  >
    <InputGroup {...props} />
  </FormGroup>
);
