import { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { tigrowApi } from 'config';

import { History } from 'history';
import { Form, Field } from 'react-final-form';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { tokenConfig } from 'stores/UtilsActions';
import { logoutAction } from 'stores/auth/Actions';

import { SubmitError } from 'components/final-form/SubmitError';
import {
  checkError,
  required,
  passwordValidation,
  composeValidators,
  errorMessgeHandler,
} from 'components/final-form/utils';
import InputTooltip from 'components/input-tooltip/InputTooltip';
import { InputGroupFieldWithError } from '../../../components/fields/InputGroupField';

const validation = {
  rules: [
    'At least 1 capital letter',
    'At least 1 small letter',
    'At least 1 special character',
    'At least 1 numeric value',
  ],
};

const ChangePasswordComponentView = (
  props: {
    setShowDialog: (val: boolean) => void;
    logoutAction: (history: History) => void;
  } & RouteComponentProps,
) => {
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChangePassword = async (changePasswordInfo: {}) => {
    try {
      const headers = tokenConfig();
      let response;
      if ((headers as any).headers.Authorization) {
        response = await tigrowApi.put(
          'accounts/change-password',
          changePasswordInfo,
          headers,
        );
      } else {
        // tslint:disable-next-line: no-console
      }
      return errorMessgeHandler(response);
    } catch (error) {
      return errorMessgeHandler(error);
    }
  };

  const onSubmit = async (values: any) => {
    const changePasswordvalues = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    const response = await handleChangePassword(changePasswordvalues);
    if (response.message === 200) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        props.setShowDialog(false);
        props.logoutAction(props.history);
      }, 3000);
      return true;
    }
    return { [response.fieldName]: response.message };
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={(values: any) => {
        const errors = {} as any;
        if (isEqual(values.newPassword, values.oldPassword)) {
          errors.newPassword =
            'Old and New Password must be different';
        }
        if (!isEqual(values.newPassword, values.confirmPassword)) {
          errors.confirmPassword = 'Mismatch Password';
        }
        return errors;
      }}
      render={({
        handleSubmit,
        form,
        submitting,
        pristine,
        values,
        submitError,
        hasValidationErrors,
        ...rest
      }) => (
        <form className="pa4" onSubmit={handleSubmit}>
          {showSuccessMessage && (
            <h3 className="green">
              "Your password has been changed Successfully"
            </h3>
          )}
          <SubmitError errorMessage={submitError} />
          <h1 className="f5 lh-copy  mb4 tigrow-lightBlue">
            Change Password
          </h1>
          <div>
            <h1 className="f6">Old Password</h1>
            <Field<string>
              name="oldPassword"
              validate={required}
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <InputGroupFieldWithError
                    id="oldPassword"
                    type={`${showPasswordOld ? 'text' : 'password'}`}
                    value={input.value}
                    onChange={input.onChange}
                    placeHolder="Old Password"
                    leftIcon="lock"
                    rightElement={
                      <Icon
                        icon={
                          showPasswordOld ? 'eye-open' : 'eye-off'
                        }
                        color="#08A0F7"
                        onClick={(e) =>
                          setShowPasswordOld(!showPasswordOld)
                        }
                        className="pt2 pr2 pointer"
                      />
                    }
                    className={`br0 mt1 ${
                      checkError(meta)
                        ? 'bb b--red'
                        : 'bb b--lightBlue'
                    }`}
                    leftIconColor={`${
                      checkError(meta) ? 'red' : '#08A0F7'
                    }`}
                    style={{
                      boxShadow: 'none',
                    }}
                    error={
                      checkError(meta) &&
                      (meta.error || meta.submitError)
                    }
                  />
                </div>
              )}
            />
          </div>
          <div>
            <h1 className="f6">New Password</h1>
            <Field<string>
              name="newPassword"
              validate={composeValidators(
                required,
                passwordValidation,
              )}
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <InputGroupFieldWithError
                    id="newPassword"
                    type={`${showPasswordNew ? 'text' : 'password'}`}
                    value={input.value}
                    onChange={input.onChange}
                    placeHolder="New Password"
                    leftIcon="lock"
                    rightElement={
                      <span>
                        <Icon
                          icon={
                            showPasswordNew ? 'eye-open' : 'eye-off'
                          }
                          color="#08A0F7"
                          onClick={(e) =>
                            setShowPasswordNew(!showPasswordNew)
                          }
                          className="pt2 pr2 pointer"
                        />
                        <span
                          style={{
                            position: 'absolute',
                            left: '40px',
                          }}
                          className="hidden-small"
                        >
                          <InputTooltip
                            content="Choose a password at least 8 characters long"
                            direction="right"
                            validations={validation}
                          >
                            <span
                              role="img"
                              aria-label="question mark"
                              style={{
                                position: 'absolute',
                                top: '7px',
                              }}
                            >
                              <img
                                src="https://svgshare.com/i/Q3c.svg"
                                alt="question mark logo"
                              />
                            </span>
                          </InputTooltip>
                        </span>
                      </span>
                    }
                    className={`br0 mt1 ${
                      checkError(meta)
                        ? 'bb b--red'
                        : 'bb b--lightBlue'
                    }`}
                    leftIconColor={`${
                      checkError(meta) ? 'red' : '#08A0F7'
                    }`}
                    style={{
                      boxShadow: 'none',
                    }}
                    error={
                      checkError(meta) &&
                      (meta.error || meta.submitError)
                    }
                  />
                </div>
              )}
            />
          </div>
          <div>
            <h1 className="f6">Confirm Password</h1>
            <Field<string>
              name="confirmPassword"
              validate={required}
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <InputGroupFieldWithError
                    id="confirmPassword"
                    type={`${
                      showPasswordConfirm ? 'text' : 'password'
                    }`}
                    value={input.value}
                    onChange={input.onChange}
                    placeHolder="Confirm Password"
                    leftIcon="lock"
                    rightElement={
                      <Icon
                        icon={
                          showPasswordConfirm ? 'eye-open' : 'eye-off'
                        }
                        color="#08A0F7"
                        onClick={(e) =>
                          setShowPasswordConfirm(!showPasswordConfirm)
                        }
                        className="pt2 pr2 pointer"
                      />
                    }
                    className={`br0 mt1 ${
                      checkError(meta)
                        ? 'bb b--red'
                        : 'bb b--lightBlue'
                    }`}
                    leftIconColor={`${
                      checkError(meta) ? 'red' : '#08A0F7'
                    }`}
                    style={{
                      boxShadow: 'none',
                    }}
                    error={
                      checkError(meta) &&
                      (meta.error || meta.submitError)
                    }
                  />
                </div>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              className="w4 grow h2 pointer mr3"
              style={{
                background: '#fff',
                outline: 'none',
                border: '1px solid #08A0F7',
                color: '#08A0F7',
              }}
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
            >
              cancel
            </Button>
            <Button
              className="w4 grow h2 pointer"
              style={{
                background: '#08A0F7',
                outline: 'none',
                color: 'white',
              }}
              loading={submitting}
              type="submit"
              disabled={submitting || pristine}
            >
              Save
            </Button>
          </div>
        </form>
      )}
    />
  );
};

export const ChangePasswordComponent = connect(null, {
  logoutAction,
})(withRouter(ChangePasswordComponentView));
