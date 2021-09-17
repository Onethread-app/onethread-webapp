import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isEqual, isEmpty } from 'lodash';

import { Form, Field } from 'react-final-form';
import { RadioGroup } from '@blueprintjs/core/lib/esm/components/forms/radioGroup';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Radio } from '@blueprintjs/core/lib/esm/components/forms/controls';
import { DateInput } from '@blueprintjs/datetime/lib/esm/dateInput';

import { User } from 'stores/user/Reducer';
import { editUserInfoAction } from 'stores/user/Actions';
import { saveUserBasicInfoForm } from 'stores/UserBasicInfoDetailsForm/Actions';

import {
  checkError,
  isEmail,
  maxValue,
} from 'components/final-form/utils';
import {
  InputGroupField,
  InputGroupFieldWithError,
} from 'components/fields/InputGroupField';
import { DropdownField } from 'components/fields/DropdownField';
import { SubmitError } from 'components/final-form/SubmitError';

import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';

interface IBasicInfoProps {
  setShowDialog: (val: boolean) => void;
}
interface IBasicInfoInternalProps extends IBasicInfoProps {
  userInfo: User;
  editInfoAction: (val: User) => any;
  saveUserBasicInfoForm: any;
  previousData: any;
}

const BasicInfoFormComponent = (props: IBasicInfoInternalProps) => {
  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState<any>([]);
  const [data, setData] = useState<any>([]);

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
      props.saveUserBasicInfoForm({});
      return true;
    }
    return { [response.fieldName]: response.message };
  };

  const handleChange = (name: string, value: any) => {
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    setDefaultValues(props.previousData);
  }, []);

  useEffect(() => {
    props.saveUserBasicInfoForm(data);
  }, [data]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        email: props.userInfo.email,
        secondaryEmail:
          props.userInfo.secondaryEmail ||
          defaultValues.secondaryEmail,
        // contactNo: props.userInfo.contactNo.substring(3),
        location: props.userInfo.location || defaultValues.location,
        gender: props.userInfo.gender || defaultValues.gender,
        birthDate:
          props.userInfo.birthDate || defaultValues.birthDate,
        bloodGroup:
          props.userInfo.bloodGroup || defaultValues.bloodGroup,
      }}
      validate={(values: any) => {
        const errors = {} as any;
        if (isEqual(values.email, values.secondaryEmail)) {
          errors.secondaryEmail = `You can't use same Primary Email and Secondary Email`;
        }
        // if (values.contactNo && values.contactNo.length !== 11) {
        //   errors.contactNo = 'Not more or less than 11 character';
        // }
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
        <form className="fl w-100 ph4 pt5" onSubmit={handleSubmit}>
          <SubmitError errorMessage={submitError} />
          <h1 className="f5 lh-title white mb4">
            Edit Basic Information
          </h1>
          <Field<string>
            name="email"
            render={({ input, meta }) => (
              <div className="mb4">
                <label>{t('app.user.Personal-profile.Email')}</label>
                <InputGroupField
                  id="email"
                  className="mt1 bg-white"
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: 'none',
                  }}
                  disabled={true}
                />
              </div>
            )}
          />
          <Field<string>
            name="secondaryEmail"
            validate={values.secondaryEmail ? isEmail : undefined}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>
                  {t('app.user.Personal-profile.Secondaty')}
                </label>
                <InputGroupFieldWithError
                  id="secondaryEmail"
                  className="mt1"
                  value={input.value}
                  onChange={(e) => {
                    input.onChange(e);
                    handleChange('secondaryEmail', e.target.value);
                  }}
                  style={{
                    boxShadow: 'none',
                  }}
                  error={
                    checkError(meta) &&
                    (meta.error || meta.submitError)
                  }
                  autoFocus={true}
                />
              </div>
            )}
          />
          {/* <label>Contact No</label>
          <Field<string>
            name="contactNo"
            validate={required}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <InputGroupFieldWithError
                  id="contactNo"
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: 'none',
                  }}
                  keypress={(e) => {
                    if (e.which < 48 || e.which > 57) {
                      e.preventDefault();
                    }
                  }}
                  error={
                    checkError(meta) &&
                    (meta.error || meta.submitError)
                  }
                />
              </div>
            )}
          /> */}
          <Field<string>
            name="location"
            validate={maxValue(120)}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>
                  {t('app.user.Personal-profile.Address')}
                </label>
                <InputGroupFieldWithError
                  id="location"
                  value={input.value}
                  onChange={(e) => {
                    input.onChange(e);
                    handleChange('location', e.target.value);
                  }}
                  style={{
                    boxShadow: 'none',
                  }}
                  className="mt1"
                  error={
                    checkError(meta) &&
                    (meta.error || meta.submitError)
                  }
                />
              </div>
            )}
          />
          <div className="mb4">
            <label>{t('app.user.Personal-profile.Blood')}</label>
            <Field<string>
              name="bloodGroup"
              render={({ input, meta }) => (
                <DropdownField
                  id="bloodGroup"
                  selectedValue={input.value}
                  options={[
                    { _id: 'A+', name: 'A+' },
                    { _id: 'A-', name: 'A-' },
                    { _id: 'O+', name: 'O+' },
                    { _id: 'O-', name: 'O-' },
                    { _id: 'AB+', name: 'AB+' },
                    { _id: 'AB-', name: 'AB-' },
                    { _id: 'B+', name: 'B+' },
                    { _id: 'B-', name: 'B-' },
                  ]}
                  onChange={(e) => {
                    input.onChange(e);
                    handleChange('bloodGroup', e.target.value);
                  }}
                  className="bn"
                />
              )}
            />
          </div>
          <Field<string>
            name="birthDate"
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>
                  {t('app.user.Personal-profile.Date-of-birth')}
                </label>
                <DateInput
                  className="bg-white"
                  formatDate={(date: Date) =>
                    date.toLocaleDateString()
                  }
                  parseDate={(str: string) => new Date(str)}
                  onChange={(e) => {
                    input.onChange(e);
                    handleChange('birthDate', e);
                  }}
                  canClearSelection={false}
                  value={
                    values.birthDate
                      ? new Date(values.birthDate)
                      : null
                  }
                  popoverProps={{
                    targetClassName: 'w-100 bg-white br2',
                  }}
                  minDate={new Date('1930-01-01')}
                  maxDate={maxBirthDate()}
                  disabled={false}
                />
                {checkError(meta) && (
                  <small className="mv3" style={{ color: 'red' }}>
                    {meta.error || meta.submitError}
                  </small>
                )}
              </div>
            )}
          />
          <Field<string>
            name="gender"
            type="radio"
            render={({ input, meta }) => (
              <RadioGroup
                name="gender"
                label={t('app.user.Personal-profile.Gender')}
                onChange={(e: any) => {
                  input.onChange(e);
                  handleChange('gender', e.target.value);
                }}
                inline={true}
                className="tigrow-lightBlue outline-0"
                selectedValue={values.gender}
              >
                {['female', 'male', 'others'].map((item: any) => (
                  <Radio
                    label={item}
                    value={item}
                    className={`${
                      isEqual(values.gender, item) ? ':checked' : ''
                    }`}
                  />
                ))}
              </RadioGroup>
            )}
          />
          <div className="flex justify-end">
            <Button
              className="w4 grow h2 pointer mr3"
              style={{
                background: '#34b3e9',
                outline: 'none',
                color: 'white',
              }}
              loading={submitting}
              type="submit"
              disabled={submitting || pristine}
            >
              Save
            </Button>
            <Button
              className="w4 grow h2 pointer"
              style={{
                background: '#fff',
                outline: 'none',
                border: '1px solid #34b3e9',
                color: '#34b3e9',
              }}
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
            >
              cancel
            </Button>
          </div>
        </form>
      )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    userInfo: state.userReducer.user,
    previousData: state.userBasicInfoFormReducer.data,
  };
};

export const BasicInfoForm = connect(mapStateToProps, {
  editInfoAction: editUserInfoAction,
  saveUserBasicInfoForm,
})(BasicInfoFormComponent);
