import React from 'react';
import { connect } from 'react-redux';
import { editUserInfoAction } from 'stores/user/Actions';
import { Button, RadioGroup, Radio } from '@blueprintjs/core';
import { InputGroupField, InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { User } from 'stores/user/Reducer';
import { DateInput } from '@blueprintjs/datetime';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import { isEqual } from 'lodash';
import { Form, Field } from 'react-final-form';
import { required, checkError, isEmail } from 'components/final-form/utils';
import { DropdownField } from 'components/fields/DropdownField';

import phoneIcon from '../../../resources/images/phone.png';
import nameTagIcon from './../../../resources/images/nameTag.png';
import warningIcon from './../../../resources/images/warningIcon.png';

interface BasicInfoProps {
  setShowDialog: (val: boolean) => void;
}
interface BasicInfoInternalProps extends BasicInfoProps {
  userInfo: User;
  editInfoAction: (val: User) => any;
}

const BasicInfoFormComponent = (props: BasicInfoInternalProps) => {

  const maxBirthDate = () => {
    const d = new Date();
    const maxDate = d.getFullYear() - 13;
    d.setFullYear(maxDate);
    return d;
  };

  const onSubmit = async (values: any) => {

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
          className="fl w-100 pa4"
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
          <h1 className="f5 lh-title ml2 tigrow-lightBlue mb4">Basic Information</h1>
          <Field<string>
            name="email"
            render={({ input, meta }) =>
              <div className="mb4">
                <InputGroupField
                  id="email"
                  className="br0 bb b--lightBlue"
                  value={input.value}
                  onChange={input.onChange}
                  leftIcon={
                    <span className="bp3-icon">
                      <img
                        src={nameTagIcon}
                        width="20px"
                        height="20px"
                        color="#0fa3a3"
                      />
                    </span>
                  }
                  style={{
                    boxShadow: 'none'
                  }}
                  disabled={true}
                  placeHolder="Email"
                />
              </div>
            }
          />
          <Field<string>
            name="secondaryEmail"
            validate={isEmail}
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <InputGroupFieldWithError
                  id="secondaryEmail"
                  className={`br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                  value={input.value}
                  onChange={input.onChange}
                  leftIcon={
                    <span className="bp3-icon">
                      <img
                        src={nameTagIcon}
                        width="20px"
                        height="20px"
                        color="#0fa3a3"
                      />
                    </span>
                  }
                  style={{
                    boxShadow: 'none'
                  }}
                  placeHolder="Secondary Email"
                  error={checkError(meta) && (meta.error || meta.submitError)}
                />
              </div>
            }
          />
          <div className="flex justify-content">
            <div className=" w-20 ">
              <InputGroupField
                id="countryCode"
                className="br0 bb b--lightBlue"
                value="+88"
                readOnly={true}
                leftIcon={
                  <span className="bp3-icon">
                    <img
                      src={phoneIcon}
                      width="20px"
                      height="20px"
                      color="#0fa3a3"
                    />
                  </span>
                }
                style={{
                  boxShadow: 'none'
                }}
              />
            </div>
            <div className="ml3 flex-auto">
              <Field<string>
                name="contactNo"
                validate={required}
                render={({ input, meta }) =>
                  <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                    <InputGroupFieldWithError
                      id="contactNo"
                      className={`br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
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
                      placeHolder="e.g. 01789442325"
                      error={checkError(meta) && (meta.error || meta.submitError)}
                    />
                  </div>
                }
              />
            </div>
          </div>
          <Field<string>
            name="location"
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <InputGroupField
                  id="location"
                  value={input.value}
                  onChange={input.onChange}
                  placeHolder="Address"
                  leftIcon="map-marker"
                  style={{
                    boxShadow: 'none'
                  }}
                  className="bb b--lightBlue"
                  leftIconColor="#0fa3a3"
                />
              </div>
            }
          />
          <div className="mb4">
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
                  leftIcon="comparison"
                />
              }
            />
          </div>
          <Field<string>
            name="birthDate"
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <DateInput
                  formatDate={(date: Date) => date.toLocaleDateString()}
                  parseDate={(str: string) => new Date(str)}
                  onChange={input.onChange}
                  placeholder={'Birth date'}
                  canClearSelection={false}
                  value={values.birthDate ? new Date(values.birthDate) : null}
                  className={`br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
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
          <div className="fr mr4 mb4">
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
