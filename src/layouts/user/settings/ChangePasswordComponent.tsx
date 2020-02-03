import React, { useState } from 'react';
import { InputGroupFieldWithError } from '../../../components/fields/InputGroupField';
import { Button, Icon } from '@blueprintjs/core';
import { isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { withRouter, RouteComponentProps } from 'react-router';
import { tokenConfig } from 'stores/UtilsActions';
import { connect } from 'react-redux';
import { logoutAction } from 'stores/auth/Actions';
import { History } from 'history';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { checkError, required, passwordValidation, composeValidators, errorMessgeHandler } from 'components/final-form/utils';

const ChangePasswordComponentView = (props: {
  setShowDialog: (val: boolean) => void
  logoutAction: (history: History) => void
} & RouteComponentProps) => {

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChangePassword = async (
    changePasswordInfo: {}
  ) => {
    try {
      const headers = tokenConfig();
      let response;
      if ((headers as any).headers.Authorization) {
        response = await tigrowApi.put('accounts/change-password', changePasswordInfo, headers);
      } else {
        console.log('error in user fetching');
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
          errors.newPassword = 'Old and New Password must be different';
        }
        if (!isEqual(values.newPassword, values.confirmPassword)) {
          errors.confirmPassword = 'Mismatch Password';
        }
        return errors;
      }}
      render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
        <form
          className="pa4"
          onSubmit={handleSubmit}
        >
          {showSuccessMessage && <h3 className="green">"Your password has been changed Successfully"</h3>}
          <SubmitError errorMessage={submitError} />
          <h1 className="f5 lh-copy  mb4 tigrow-lightBlue">Change Password</h1>
          <div>
            <h1 className="f6">Old Password</h1>
            <Field<string>
              name="oldPassword"
              validate={required}
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <InputGroupFieldWithError
                    id="oldPassword"
                    type={`${showPassword ? 'text' : 'password'}`}
                    value={input.value}
                    onChange={input.onChange}
                    placeHolder="Old Password"
                    leftIcon="lock"
                    rightElement={
                      <Icon
                        icon={showPassword ? 'eye-open' : 'eye-off'}
                        color="#0fa3a3"
                        onClick={e => setShowPassword(!showPassword)}
                        className="pt2 pr2 pointer"
                      />
                    }
                    className={`br0 mt1 ${checkError(meta) ? 'bb b--red' : 'bb b--lightBlue'}`}
                    leftIconColor={`${checkError(meta) ? 'red' : '#0fa3a3'}`}
                    style={{
                      boxShadow: 'none'
                    }}
                    error={checkError(meta) && (meta.error || meta.submitError)}
                  />
                </div>
              }
            />
          </div>
          <div>
            <h1 className="f6">New Password</h1>
            <Field<string>
              name="newPassword"
              validate={composeValidators(required, passwordValidation)}
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <InputGroupFieldWithError
                    id="newPassword"
                    type={`${showPassword ? 'text' : 'password'}`}
                    value={input.value}
                    onChange={input.onChange}
                    placeHolder="New Password"
                    leftIcon="lock"
                    rightElement={
                      <Icon
                        icon={showPassword ? 'eye-open' : 'eye-off'}
                        color="#0fa3a3"
                        onClick={e => setShowPassword(!showPassword)}
                        className="pt2 pr2 pointer"
                      />
                    }
                    className={`br0 mt1 ${checkError(meta) ? 'bb b--red' : 'bb b--lightBlue'}`}
                    leftIconColor={`${checkError(meta) ? 'red' : '#0fa3a3'}`}
                    style={{
                      boxShadow: 'none'
                    }}
                    error={checkError(meta) && (meta.error || meta.submitError)}
                  />
                </div>
              }
            />
          </div>
          <div>
            <h1 className="f6">Confirm Password</h1>
            <Field<string>
              name="confirmPassword"
              validate={required}
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <InputGroupFieldWithError
                    id="confirmPassword"
                    type={`${showPassword ? 'text' : 'password'}`}
                    value={input.value}
                    onChange={input.onChange}
                    placeHolder="Confirm Password"
                    leftIcon="lock"
                    rightElement={
                      <Icon
                        icon={showPassword ? 'eye-open' : 'eye-off'}
                        color="#0fa3a3"
                        onClick={e => setShowPassword(!showPassword)}
                        className="pt2 pr2 pointer"
                      />
                    }
                    className={`br0 mt1 ${checkError(meta) ? 'bb b--red' : 'bb b--lightBlue'}`}
                    leftIconColor={`${checkError(meta) ? 'red' : '#0fa3a3'}`}
                    style={{
                      boxShadow: 'none'
                    }}
                    error={checkError(meta) && (meta.error || meta.submitError)}
                  />
                </div>
              }
            />
          </div>
          <div className="flex justify-end">
            <Button className="w4 grow h2 pointer mr3"
              style={{ background: '#fff', outline: 'none', border: '1px solid #0fa3a3', color: '#0fa3a3' }}
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
            >
              cancel
              </Button>
            <Button
              className="w4 grow h2 pointer"
              style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
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

export const ChangePasswordComponent = connect(null, { logoutAction })(withRouter(ChangePasswordComponentView));