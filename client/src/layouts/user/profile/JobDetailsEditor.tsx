import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import { DateInput } from '@blueprintjs/datetime/lib/esm/dateInput';
import { TextArea } from '@blueprintjs/core/lib/esm/components/forms/textArea';
import { Checkbox } from '@blueprintjs/core/lib/esm/components/forms/controls';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { IExperience } from 'stores/user/Reducer';
import {
  addJobExperienceAction,
  editJobExperienceAction,
} from 'stores/user/Actions';
import { saveJobDetailsForm } from 'stores/jobDetailsForm/Actions';

import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';

interface IJobFormProps {
  setShowDialog: (val: boolean) => void;
  edit: boolean;
  values?: IExperience;
}
interface IJobFormInternalProps extends IJobFormProps {
  addJobExperienceAction: (val: {}) => any;
  editJobExperienceAction: (jobInfo: {}, id: string) => any;
  saveJobDetailsForm: any;
  previousData: any;
}

const JobFormComponent = (props: IJobFormInternalProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const [defaultValues, setDefaultValues] = useState<any>([]);

  const handleChange = (name: string, value: any) => {
    setData({ ...data, [name]: value });
  };

  const onSubmit = async (values: any) => {
    let response;
    if (values.currentlyWork) {
      delete values.endingYear;
    }
    if (props.edit === false) {
      delete values._id;
    }
    if (props.edit === false) {
      response = await props.addJobExperienceAction(values);
      props.saveJobDetailsForm({});
    } else if (props.edit === true) {
      response = await props.editJobExperienceAction(
        values,
        values._id,
      );
      props.saveJobDetailsForm({});
    }
    if (response.message === 200) {
      props.setShowDialog(false);
      return true;
    }
    return { [response.fieldName]: response.message };
  };

  useEffect(() => {
    setDefaultValues(props.previousData);
  }, []);

  useEffect(() => {
    props.saveJobDetailsForm(data);
  }, [data]);

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          _id:
            props.values && props.values._id ? props.values._id : '',
          companyName:
            props.values && props.values.name
              ? props.values.name
              : defaultValues.companyName
              ? defaultValues.companyName
              : '',
          positionName:
            props.values && props.values.qualification
              ? props.values.qualification
              : defaultValues.positionName
              ? defaultValues.positionName
              : '',
          // TODO: Date type must be used instead of string
          startYear:
            props.values && props.values.startYear
              ? props.values.startYear
              : defaultValues.startYear
              ? defaultValues.startYear
              : '',
          endingYear:
            props.values && props.values.endingYear
              ? props.values.endingYear
              : defaultValues.endingYear
              ? defaultValues.endingYear
              : '',
          currentlyWork:
            props.values && props.values.currentStatus
              ? props.values.currentStatus
              : defaultValues.currentlyWork
              ? defaultValues.currentlyWork
              : false,
          jobDescription:
            props.values && props.values.description
              ? props.values.description
              : defaultValues.jobDescription
              ? defaultValues.jobDescription
              : '',
        }}
        validate={(values: any) => {
          const errors = {} as any;
          if (
            values.startYear !== '' &&
            values.endingYear === '' &&
            values.currentlyWork === false
          ) {
            errors.endingYear = 'required';
            errors.currentlyWork = 'required';
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
          <form className="fl w-100" onSubmit={handleSubmit}>
            <div className="mb3">
              <SubmitError errorMessage={submitError} />
            </div>
            <Field<string>
              name="companyName"
              validate={composeValidators(required, maxValue(32))}
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <label>{t('app.user.User-job.Company-name')}</label>
                  <InputGroupFieldWithError
                    id="companyName"
                    className="mt1"
                    value={input.value}
                    onChange={(e) => {
                      input.onChange(e);
                      handleChange('companyName', e.target.value);
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
            <Field<string>
              name="positionName"
              validate={composeValidators(required, maxValue(32))}
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <label>
                    {t('app.user.User-job.Position-name')}
                  </label>
                  <InputGroupFieldWithError
                    id="positionName"
                    className="mt1"
                    value={input.value}
                    onChange={(e) => {
                      input.onChange(e);
                      handleChange('positionName', e.target.value);
                    }}
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
            <Field<string>
              name="startYear"
              validate={required}
              render={({ input, meta }) => (
                <div
                  className={`${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <label>{t('app.user.User-job.Start-year')}</label>
                  <DateInput
                    formatDate={(date: Date) =>
                      date.toLocaleDateString()
                    }
                    parseDate={(str: string) => new Date(str)}
                    onChange={(e) => {
                      input.onChange(e);
                      handleChange('startYear', e);
                    }}
                    canClearSelection={false}
                    value={
                      values.startYear
                        ? new Date(values.startYear)
                        : null
                    }
                    popoverProps={{
                      targetClassName: 'w-100',
                    }}
                    minDate={new Date('1970-01-01')}
                    maxDate={
                      values.endingYear
                        ? new Date(values.endingYear)
                        : new Date()
                    }
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
              name="endingYear"
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <label>{t('app.user.User-job.End')}</label>
                  <DateInput
                    formatDate={(date: Date) =>
                      date.toLocaleDateString()
                    }
                    parseDate={(str: string) => new Date(str)}
                    onChange={(e) => {
                      input.onChange(e);
                      handleChange('endingYear', e);
                    }}
                    disabled={
                      new Date(
                        values.startYear,
                      ).toLocaleDateString() ===
                        new Date().toLocaleDateString() ||
                      values.startYear === ''
                        ? true
                        : values.currentlyWork
                    }
                    minDate={
                      values.startYear === ''
                        ? new Date()
                        : new Date(values.startYear)
                    }
                    canClearSelection={false}
                    value={
                      values.endingYear
                        ? new Date(values.endingYear)
                        : null
                    }
                    maxDate={new Date()}
                    popoverProps={{
                      targetClassName: 'w-100',
                    }}
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
              name="jobDescription"
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <label>{t('app.user.User-job.Description')}</label>
                  <TextArea
                    className="mt1"
                    id="jobDescription"
                    value={input.value}
                    onChange={(e) => {
                      input.onChange(e);
                      handleChange('jobDescription', e.target.value);
                    }}
                    style={{
                      resize: 'none',
                      minHeight: '50px',
                      maxHeight: '150px',
                    }}
                    fill={true}
                    growVertically={true}
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
              name="currentlyWork"
              type="checkbox"
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <Checkbox
                    id="currentlyWork"
                    className="white"
                    value={input.value}
                    onChange={(e) => {
                      input.onChange(e);
                      values.currentlyWork = !values.currentlyWork;
                      values.endingYear = '';
                      handleChange(
                        'currentlyWork',
                        values.currentlyWork,
                      );
                    }}
                    checked={values.currentlyWork}
                    label={t('app.user.User-job.Current-work')}
                    disabled={values.startYear === '' ? true : false}
                  />
                  {checkError(meta) && (
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}
                    </small>
                  )}
                </div>
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
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    previousData: state.jobDetailsFormReducer.data,
  };
};

export const JobForm = connect(mapStateToProps, {
  addJobExperienceAction,
  editJobExperienceAction,
  saveJobDetailsForm,
})(JobFormComponent);
