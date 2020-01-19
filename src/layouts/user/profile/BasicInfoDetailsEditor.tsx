import React from 'react';
import { connect } from 'react-redux';
import { editUserInfoAction } from 'stores/user/Actions';
import { Button, RadioGroup, Radio } from '@blueprintjs/core';
import { InputGroupField, InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { User } from 'stores/user/Reducer';
import { DateInput } from '@blueprintjs/datetime';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import { isEqual, isEmpty } from 'lodash';
import { Form, Field } from 'react-final-form';
import { required, checkError, isEmail } from 'components/final-form/utils';
import { DropdownField } from 'components/fields/DropdownField';

import warningIcon from './../../../resources/images/warningIcon.png';
interface IBasicInfoProps {
  setShowDialog: (val: boolean) => void;
}
interface IBasicInfoInternalProps extends IBasicInfoProps {
  userInfo: User;
  editInfoAction: (val: User) => any;
}

const BasicInfoFormComponent = (props: IBasicInfoInternalProps) => {

  const maxBirthDate = () => {
    const d = new Date();
    const maxDate = d.getFullYear() - 13;
    d.setFullYear(maxDate);
    return d;
  };

  const onSubmit = async (values: any) => {

    if (isEmpty(values.location)) {
      values.location = '';
    }
    const response = await props.editInfoAction(values);
    if (response.message === 200) {
      props.setShowDialog(false);
      return true;
    }
    return { [response.fieldName]: response.message };

  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        email: props.userInfo.email,
        secondaryEmail: props.userInfo.secondaryEmail,
        contactNo: props.userInfo.contactNo.substring(3),
        location: props.userInfo.location,
        gender: props.userInfo.gender,
        birthDate: props.userInfo.birthDate,
        bloodGroup: props.userInfo.bloodGroup
      }}
      validate={(values: any) => {
        const errors = {} as any;
        if (isEqual(values.email, values.secondaryEmail)) {
          errors.secondaryEmail = 'You can\'t use same Primary Email and Secondary Email';
        } else if (values.contactNo && values.contactNo.length !== 11) {
          errors.contactNo = 'Not more or less than 11 character';
        }
        return errors;
      }}
      render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
        <form
          className="fl w-100 ph2 pt5"
          onSubmit={handleSubmit}
        >
          <div>
            <Field
              name="network"
              subscription={{
                touched: true,
                error: true,
                submitError: true,
                dirtySinceLastSubmit: true
              }}
              render={({ meta }) =>
                checkError(meta) && (
                  <div
                    className="flex"
                    style={{
                      backgroundColor: '#FCEBEB', paddingLeft: '10px', paddingTop: '10px'
                    }}>
                    <span className="bp3-icon">
                      <img
                        src={warningIcon}
                        width="20px"
                        height="20px"
                        color="#0fa3a3"
                      />
                    </span>
                    <p style={{ color: '#962414', paddingLeft: '10px' }}>{meta.error || meta.submitError}</p>
                  </div>
                )
              }
            />
            <Field
              name="authError"
              subscription={{
                touched: true,
                error: true,
                submitError: true,
                dirtySinceLastSubmit: true
              }}
              render={({ meta }) =>
                checkError(meta) && (
                  <div
                    className="flex"
                    style={{
                      backgroundColor: '#FCEBEB', paddingLeft: '10px', paddingTop: '10px'
                    }}>
                    <span className="bp3-icon">
                      <img
                        src={warningIcon}
                        width="20px"
                        height="20px"
                        color="#0fa3a3"
                      />
                    </span>
                    <p style={{ color: '#962414', paddingLeft: '10px' }}>{meta.error || meta.submitError}</p>
                  </div>
                )
              }
            />
          </div>
          <h1 className="f5 lh-title white mb4">Edit Basic Information</h1>
          <Field<string>
            name="email"
            render={({ input, meta }) =>
              <div className="mb4">
                <label>Email</label>
                <InputGroupField
                  id="email"
                  className="mt1 bg-white"
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: 'none'
                  }}
                  disabled={true}
                />
              </div>
            }
          />
          <Field<string>
            name="secondaryEmail"
            validate={isEmail}
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>Secondary Email</label>
                <InputGroupFieldWithError
                  id="secondaryEmail"
                  className="mt1"
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: 'none'
                  }}
                  error={checkError(meta) && (meta.error || meta.submitError)}
                />
              </div>
            }
          />
          <label>Contact No</label>
          <Field<string>
            name="contactNo"
            validate={required}
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <InputGroupFieldWithError
                  id="contactNo"
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: 'none'
                  }}
                  keypress={(e) => {
                    if ((e.which < 48 || e.which > 57)) {
                      e.preventDefault();
                    }
                  }}
                  error={checkError(meta) && (meta.error || meta.submitError)}
                />
              </div>
            }
          />
          <Field<string>
            name="location"
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>Address</label>
                <InputGroupField
                  id="location"
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: 'none'
                  }}
                  className="mt1"
                />
              </div>
            }
          />
          <div className="mb4">
            <label>Blood Group</label>
            <Field<string>
              name="bloodGroup"
              render={({ input, meta }) =>
                <DropdownField
                  id="bloodGroup"
                  selectedValue={input.value}
                  options={
                    [{ _id: 'A+', name: 'A+' },
                    { _id: 'A-', name: 'A-' },
                    { _id: 'O+', name: 'O+' },
                    { _id: 'O-', name: 'O-' },
                    { _id: 'AB+', name: 'AB+' },
                    { _id: 'AB-', name: 'AB-' },
                    { _id: 'B+', name: 'B+' },
                    { _id: 'B-', name: 'B-' }]
                  }
                  onChange={input.onChange}
                />
              }
            />
          </div>
          <Field<string>
            name="birthDate"
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>Birth Date</label>
                <DateInput
                  formatDate={(date: Date) => date.toLocaleDateString()}
                  parseDate={(str: string) => new Date(str)}
                  onChange={input.onChange}
                  canClearSelection={false}
                  value={values.birthDate ? new Date(values.birthDate) : null}
                  popoverProps={{
                    targetClassName: 'w-100'
                  }}
                  minDate={new Date('1800-01-01')}
                  maxDate={maxBirthDate()}
                />
                {checkError(meta) &&
                  <small className="mv3" style={{ color: 'red' }}>
                    {meta.error || meta.submitError}
                  </small>}
              </div>
            }
          />
          <Field<string>
            name="gender"
            type="radio"
            render={({ input, meta }) =>
              <RadioGroup
                name="gender"
                label="Gender"
                onChange={input.onChange}
                inline={true}
                className="tigrow-lightBlue outline-0"
                selectedValue={values.gender}
              >
                {
                  ['female', 'male', 'others'].map((item: any) => (
                    <Radio
                      label={item}
                      value={item}
                      className={`${isEqual(values.gender, item) ? ':checked' : ''}`}
                    />
                  ))
                }
              </RadioGroup>
            }
          />
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

const mapStateToProps = (state: any) => {
  return {
    userInfo: state.userReducer.user
  };
};

export const BasicInfoForm = connect(mapStateToProps, { editInfoAction: editUserInfoAction })(BasicInfoFormComponent);
