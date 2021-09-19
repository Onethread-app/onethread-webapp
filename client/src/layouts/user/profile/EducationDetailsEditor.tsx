import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Field, Form } from 'react-final-form';
import { DateInput } from '@blueprintjs/datetime';
import { TextArea } from '@blueprintjs/core/lib/esm/components/forms/textArea';
import { Checkbox } from '@blueprintjs/core/lib/esm/components/forms/controls';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { IExperience } from 'stores/user/Reducer';
import {
  addEducationExperienceAction,
  editEducationExperienceAction,
} from 'stores/user/Actions';
import { saveEduDetailsForm } from 'stores/EduDetailsFrom/Actions';

import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { SubmitError } from 'components/final-form/SubmitError';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';

import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';

interface IEduFormProps {
  setShowDialog: (val: boolean) => void;
  edit: boolean;
  values?: IExperience;
}
interface IEduFormInternalProps extends IEduFormProps {
  addEducationExperienceAction: (val: {}) => any;
  editEducationExperienceAction: (jobInfo: {}, id: string) => any;
  saveEduDetailsForm: any;
  previousData: any;
}

const EducationFormComponent = (props: IEduFormInternalProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const [defaultValues, setDefaultValues] = useState<any>([]);

  const onSubmit = async (values: any) => {
    let response;
    if (values.currentlyStudy) {
      delete values.endingYear;
    }
    if (props.edit === false) {
      delete values._id;
    }
    if (props.edit === false) {
      response = await props.addEducationExperienceAction(values);
      props.saveEduDetailsForm({});
    } else if (props.edit === true) {
      response = await props.editEducationExperienceAction(
        values,
        values._id,
      );
      props.saveEduDetailsForm({});
    }
    if (response.message === 200) {
      props.setShowDialog(false);
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
    props.saveEduDetailsForm(data);
  }, [data]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        _id: props.values && props.values._id ? props.values._id : '',
        degree:
          props.values && props.values.name
            ? props.values.name
            : defaultValues.degree
            ? defaultValues.degree
            : '',
        institutionName:
          props.values && props.values.qualification
            ? props.values.qualification
            : defaultValues.institutionName
            ? defaultValues.institutionName
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
        currentlyStudy:
          props.values && props.values.currentStatus
            ? props.values.currentStatus
            : defaultValues.currentlyStudy
            ? defaultValues.currentlyStudy
            : false,
        eduDescription:
          props.values && props.values.description
            ? props.values.description
            : defaultValues.eduDescription
            ? defaultValues.eduDescription
            : '',
      }}
      validate={(values: any) => {
        const errors = {} as any;
        if (
          values.startYear !== '' &&
          values.endingYear === '' &&
          values.currentlyStudy === false
        ) {
          errors.endingYear = 'required';
          errors.currentlyStudy = 'required';
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
            name="degree"
            validate={composeValidators(required, maxValue(32))}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>{t('app.user.User-Education.Degree')}</label>
                <InputGroupFieldWithError
                  id="degree"
                  className="mt1"
                  value={input.value}
                  onChange={(e) => {
                    input.onChange(e);
                    handleChange('degree', e.target.value);
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
            name="institutionName"
            validate={composeValidators(required, maxValue(32))}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>
                  {t('app.user.User-Education.Institution')}
                </label>
                <InputGroupFieldWithError
                  id="institutionName"
                  className="mt1"
                  value={input.value}
                  onChange={(e) => {
                    input.onChange(e);
                    handleChange('institutionName', e.target.value);
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
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>
                  {t('app.user.User-Education.Start-year')}
                </label>
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
                  className={`br0 bb ${
                    checkError(meta) ? 'b--red' : 'b--lightBlue'
                  }`}
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
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>{t('app.user.User-Education.End-year')}</label>
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
                      : values.currentlyStudy
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
            name="eduDescription"
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>
                  {t('app.user.User-Education.Description')}
                </label>
                <TextArea
                  id="eduDescription"
                  className="mt1"
                  value={input.value}
                  onChange={(e) => {
                    input.onChange(e);
                    handleChange('eduDescription', e.target.value);
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
            name="currentlyStudy"
            type="checkbox"
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <Checkbox
                  id="currentlyStudy"
                  value={input.value}
                  onChange={(e) => {
                    input.onChange(e);
                    values.currentlyStudy = !values.currentlyStudy;
                    values.endingYear = '';
                    handleChange(
                      'currentlyStudy',
                      values.currentlyStudy,
                    );
                  }}
                  checked={values.currentlyStudy}
                  label={t('app.user.User-Education.Currently')}
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
  );
};

const mapStateToProps = (state: any) => {
  return {
    previousData: state.eduDetailsFormReducer.data,
  };
};

export const EducationForm = connect(mapStateToProps, {
  saveEduDetailsForm,
  addEducationExperienceAction,
  editEducationExperienceAction,
})(EducationFormComponent);
