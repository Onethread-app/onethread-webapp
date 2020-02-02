import { isEqual } from 'lodash';
import { FORM_ERROR } from 'final-form';

export const required = (value: any) => (value ? undefined : 'Required');

export const maxValue = (max: number) => (value: any) => {
  if (value === undefined || value.length <= max) {
    return undefined;
  }
  return `Should be less than or equal ${max}`;
}

export const composeValidators = (...validators: any) => (value: any) =>
  validators.reduce((error: any, validator: any) =>
    error || validator(value), undefined);

export const checkError = (meta: any) => {
  if ((meta.error || (meta.submitError && !meta.dirtySinceLastSubmit)) &&
    meta.touched) {
    return true;
  }
  return false;
};

export const isEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email && email.match(regexForEmailValidation)) {
    return undefined;
  }
  return 'Please enter a valid email';
};

export const phoneNoValidation = (phone: string) => {
  const regexForPhoneNoValidation = /^(?:\+?88)?01[1-9]\d{8}$/;
  if (phone.match(regexForPhoneNoValidation)) {
    return undefined;
  }
  return 'Please enter a 11 digit no e.g. 01711111111';
};

export const passwordValidation = (password: string) => {
  const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
  if (password.match(regex)) {
    return undefined;
  }
  return 'Please enter a valid password';
};

export const errorMessgeHandler = (handlerResponse: any) => {

  if (isEqual(handlerResponse.message, 'Network Error')) {
    return {
      message: handlerResponse.message,
      fieldName: FORM_ERROR,
      status: handlerResponse.status,
      type: ''
    };
  }

  switch (handlerResponse.status || handlerResponse.response.status) {
    case 200:
    case 201:
      return {
        message: 200,
        payload: handlerResponse,
        status: handlerResponse.status,
        type: ''
      };

    case 401:
      return {
        message: handlerResponse.response.data.errors[0].message,
        fieldName: FORM_ERROR,
        status: handlerResponse.response.status,
        type: handlerResponse.response.data.type
      };

    default:
      return {
        message: handlerResponse.response.data.errors[0].message,
        fieldName: handlerResponse.response.data.errors[0].fieldName ?
          handlerResponse.response.data.errors[0].fieldName : '',
        status: handlerResponse.response.status,
        type: handlerResponse.response.data.type
      };
  }
};
