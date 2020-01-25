import React from 'react';
import { DateInput } from '@blueprintjs/datetime';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { Checkbox, TextArea, Button } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { addJobExperienceAction, editJobExperienceAction } from 'stores/user/Actions';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';
import { IExperience } from 'stores/user/Reducer';
import { SubmitError } from 'components/final-form/SubmitError';
interface IJobFormProps {
  setShowDialog: (val: boolean) => void;
  edit: boolean;
  values?: IExperience;
}
interface IJobFormInternalProps extends IJobFormProps {
  addJobExperienceAction: (val: {}) => any;
  editJobExperienceAction: (jobInfo: {}, id: string) => any;
}

const JobFormComponent = (props: IJobFormInternalProps) => {

  const birthDate = useSelector((state: any) => state.userReducer.user.birthDate);

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
    } else if (props.edit === true) {
      response = await props.editJobExperienceAction(values, values._id);
    }
    if (response.message === 200) {
      props.setShowDialog(false);
      return true;
    }
    return { [response.fieldName]: response.message };
  };
  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          _id: props.values && props.values._id ? props.values._id : '',
          companyName: props.values && props.values.name ? props.values.name : '',
          positionName: props.values && props.values.qualification ? props.values.qualification : '',
          // TODO: Date type must be used instead of string
          startYear: props.values && props.values.startYear ? props.values.startYear : '',
          endingYear: props.values && props.values.endingYear ? props.values.endingYear : '',
          currentlyWork: props.values && props.values.currentStatus ? props.values.currentStatus : false,
          jobDescription: props.values && props.values.description ? props.values.description : ''
        }}
        validate={(values: any) => {
          const errors = {} as any;
          if (values.startYear !== '' && values.endingYear === '' && values.currentlyWork === false) {
            errors.endingYear = 'required';
            errors.currentlyWork = 'required';
          }
          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
          <form
            className="fl w-100"
            onSubmit={handleSubmit}
          >
            <div className="mb3">
              <SubmitError errorMessage={submitError} />
            </div>
            <Field<string>
              name="companyName"
              validate={required}
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>Company Name</label>
                  <InputGroupFieldWithError
                    id="companyName"
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
            <Field<string>
              name="positionName"
              validate={required}
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>Position Name</label>
                  <InputGroupFieldWithError
                    id="positionName"
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
            <Field<string>
              name="startYear"
              validate={required}
              render={({ input, meta }) =>
                <div className={`${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>Start Year</label>
                  <DateInput
                    formatDate={(date: Date) => date.toLocaleDateString()}
                    parseDate={(str: string) => new Date(str)}
                    onChange={input.onChange}
                    canClearSelection={false}
                    value={values.startYear ? new Date(values.startYear) : null}
                    popoverProps={{
                      targetClassName: 'w-100'
                    }}
                    minDate={moment(birthDate).add(10, 'years').toDate()}
                    maxDate={values.endingYear ? new Date(values.endingYear) : new Date()}
                  />
                  {checkError(meta) &&
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}
                    </small>}
                </div>
              }
            />
            <Field<string>
              name="endingYear"
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>End Year</label>
                  <DateInput
                    formatDate={(date: Date) => date.toLocaleDateString()}
                    parseDate={(str: string) => new Date(str)}
                    onChange={input.onChange}
                    disabled={
                      new Date(values.startYear).toLocaleDateString() === new Date().toLocaleDateString()
                        || values.startYear === '' ? true : values.currentlyWork
                    }
                    minDate={values.startYear === '' ? new Date() : new Date(values.startYear)}
                    canClearSelection={false}
                    value={values.endingYear ? new Date(values.endingYear) : null}
                    maxDate={new Date()}
                    popoverProps={{
                      targetClassName: 'w-100'
                    }}
                  />
                  {checkError(meta) &&
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}
                    </small>
                  }
                </div>
              }
            />
            <Field<string>
              name="jobDescription"
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>Description</label>
                  <TextArea
                    className="mt1"
                    id="jobDescription"
                    value={input.value}
                    onChange={input.onChange}
                    style={{
                      resize: 'none',
                      minHeight: '50px',
                      maxHeight: '150px'
                    }}
                    fill={true}
                    growVertically={true}
                  />
                  {checkError(meta) &&
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}
                    </small>}
                </div>
              }
            />
            <Field<string>
              name="currentlyWork"
              type="checkbox"
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <Checkbox
                    id="currentlyWork"
                    className="white"
                    value={input.value}
                    onChange={(e) => {
                      input.onChange(e);
                      values.currentlyWork = !values.currentlyWork;
                      values.endingYear = '';
                    }}
                    checked={values.currentlyWork}
                    label="I currently work here"
                    disabled={values.startYear === '' ? true : false}
                  />
                  {checkError(meta) &&
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}
                    </small>
                  }
                </div>
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
    </>
  );
};

export const JobForm = connect(null, { addJobExperienceAction, editJobExperienceAction })(JobFormComponent);
