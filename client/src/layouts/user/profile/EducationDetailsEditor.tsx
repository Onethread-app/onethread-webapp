import React from 'react';
import { DateInput } from '@blueprintjs/datetime';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { Checkbox, TextArea, Button } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { Field, Form } from 'react-final-form';
import { connect } from 'react-redux';
import {
  addEducationExperienceAction,
  editEducationExperienceAction,
} from 'stores/user/Actions';
import { IExperience } from 'stores/user/Reducer';
import { SubmitError } from 'components/final-form/SubmitError';
interface IEduFormProps {
  setShowDialog: (val: boolean) => void;
  edit: boolean;
  values?: IExperience;
}
interface IEduFormInternalProps extends IEduFormProps {
  addEducationExperienceAction: (val: {}) => any;
  editEducationExperienceAction: (jobInfo: {}, id: string) => any;
  isEditingUser: boolean;
}

const EducationFormComponent = (props: IEduFormInternalProps) => {
  const birthDate = useSelector(
    (state: any) => state.userReducer.user.birthDate,
  );

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
    } else if (props.edit === true) {
      response = await props.editEducationExperienceAction(
        values,
        values._id,
      );
    }
    if (response && props.isEditingUser === false) {
      props.setShowDialog(false);
      return true;
    }
    return { [response.fieldName]: response.message };
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        _id: props.values && props.values._id ? props.values._id : '',
        degree:
          props.values && props.values.name ? props.values.name : '',
        institutionName:
          props.values && props.values.qualification
            ? props.values.qualification
            : '',
        // TODO: Date type must be used instead of string
        startYear:
          props.values && props.values.startYear
            ? props.values.startYear
            : '',
        endingYear:
          props.values && props.values.endingYear
            ? props.values.endingYear
            : '',
        currentlyStudy:
          props.values && props.values.currentStatus
            ? props.values.currentStatus
            : false,
        eduDescription:
          props.values && props.values.description
            ? props.values.description
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
                <label>Degree</label>
                <InputGroupFieldWithError
                  id="degree"
                  className="mt1"
                  value={input.value}
                  onChange={input.onChange}
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
            name="institutionName"
            validate={composeValidators(required, maxValue(32))}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <label>Institution Name</label>
                <InputGroupFieldWithError
                  id="institutionName"
                  className="mt1"
                  value={input.value}
                  onChange={input.onChange}
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
                <label>Start Year</label>
                <DateInput
                  formatDate={(date: Date) =>
                    date.toLocaleDateString()
                  }
                  parseDate={(str: string) => new Date(str)}
                  onChange={input.onChange}
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
                  minDate={new Date(birthDate)}
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
                <label>End Year</label>
                <DateInput
                  formatDate={(date: Date) =>
                    date.toLocaleDateString()
                  }
                  parseDate={(str: string) => new Date(str)}
                  onChange={input.onChange}
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
                <label>Description</label>
                <TextArea
                  id="eduDescription"
                  className="mt1"
                  value={input.value}
                  onChange={input.onChange}
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
                  }}
                  checked={values.currentlyStudy}
                  label="I currently study here"
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
                background: '#fff',
                outline: 'none',
                border: '1px solid #0fa3a3',
                color: '#0fa3a3',
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
                background: '#0fa3a3',
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

const mapStateToProps = (state: any) => {
  return {
    userInfo: state.userReducer.user,
    isEditingUser: state.userReducer.isEditingUser,
  };
};

export const EducationForm = connect(mapStateToProps, {
  addEducationExperienceAction,
  editEducationExperienceAction,
})(EducationFormComponent);
