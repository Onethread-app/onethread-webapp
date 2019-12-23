import { isEqual } from "lodash";

export const required = (value: any) => (value ? undefined : "Required");

export const maxValue = (max: number) => (value: any) =>
  value.length <= max ? undefined : `Should be less than or equal ${max}`

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
  const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regexForEmailValidation)) {
    return undefined;
  } 
  return 'Please enter a valid email';
}

export const phoneNoValidation = (number: string) => {
  const regexForPhoneNoValidation = /^(?:\+?88)?01[1-9]\d{8}$/;
  if (number.match(regexForPhoneNoValidation)) {
    return undefined;
  }
  return "Please enter a 11 digit no e.g. 01711111111";
}

export const passwordValidation = (password: string) => {
  const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
  if (password.match(regex)) {
    return undefined;
  }
  return "Please enter a valid password"
}

export const errorMessgeHandler = (handlerResponse: any) => {
  if (isEqual(handlerResponse.message, "Network Error")) {
    return {
      message: handlerResponse.message,
      fieldName: "network"
    };
  }
  if (handlerResponse.status === 200 || handlerResponse.status === 201) {
    return {
      message: 200,
      payload: handlerResponse
    }
  }
  return {
    message: handlerResponse.response.data.errors[0].message,
    fieldName: handlerResponse.response.data.errors[0].fieldName ? 
                handlerResponse.response.data.errors[0].fieldName : "authError"
  }
}
