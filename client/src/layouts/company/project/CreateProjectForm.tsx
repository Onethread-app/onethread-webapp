import React, { useState } from 'react';
import { Button, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';

import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import { Switch } from '@blueprintjs/core';

import {
  checkError,
  required,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { Color } from 'stores/UtilsActions';
import { isEqual } from 'lodash';
// import { SuggestFieldWithError } from 'components/fields/SuggestField';
import { ICompany } from 'stores/company/Reducer';
// import { useLiveSearch } from 'components/useLiveSearch';
import { createProjectInCompany } from '../../../stores/project/Actions';
import { getAllDepartments } from '../../../stores/company/Actions';

import { Associate } from 'stores/associate/Reducer';
import arrayMutators from 'final-form-arrays';
import { DateInput } from '@blueprintjs/datetime';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface IProject {
  department: string;
  projectType: string;
}

export interface IDepartment {
  name: string;
  _id: string;
}

const FormComponent = (props: {
  setShowProjectDialog: (val: boolean) => void;
  departments: IDepartment[];
  createProjectInCompany: (val: {}) => void;
  company: ICompany;
  associates: Associate[];
}) => {
  const [labelColor, setLabelColor] = useState(null as any);

  const [hasDeadline, setHasDeadline] = useState(false);

  const onSubmit = async (values: IProject) => {
    if (
      values.department ? values.department.length > 1 : undefined
    ) {
      values.projectType = 'md';
    }
    await props.createProjectInCompany(values);
    if (props.setShowProjectDialog) {
      props.setShowProjectDialog(false);
    }
    return {};
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="pl3" style={{ marginTop: '6rem' }}>
        <h3>{t('app.forms.Start-project.Create-project')}</h3>
        {/* <h3>Create Project</h3> */}
      </div>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        render={({
          handleSubmit,
          form: {
            mutators: { push, pop },
          },
          form,
          submitting,
          pristine,
          values,
          submitError,
          hasValidationErrors,
          ...rest
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="pa3 justify-content w-100">
              <Field<string>
                name="name"
                validate={composeValidators(required, maxValue(32))}
                render={({ input, meta }) => (
                  <div
                    className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}
                  >
                    <InputGroupFieldWithLabel
                      id="name"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                        fontSize: '18px',
                      }}
                      error={
                        checkError(meta) &&
                        (meta.error || meta.submitError)
                      }
                      label={t('app.forms.Start-project.Name')}
                      // label="Project Name (required)"
                      autoFocus={true}
                    />
                  </div>
                )}
              />

              <Switch
                checked={hasDeadline}
                label="Add Deadline"
                onChange={() => setHasDeadline(!hasDeadline)}
                className="dib"
              />
              {hasDeadline && (
                <div>
                  <Field<string>
                    name="deadline"
                    validate={required}
                    render={({ input, meta }) => (
                      <div>
                        <div
                          className={`flex bw1 pb1 br0 flex items-center `}
                        >
                          <div>
                            <Icon
                              icon="calendar"
                              className="mr2"
                              style={{ color: '#34b3e9' }}
                              iconSize={30}
                            />
                          </div>
                          <DateInput
                            formatDate={(date: Date) =>
                              date.toLocaleDateString()
                            }
                            parseDate={(str: string) => new Date(str)}
                            onChange={input.onChange}
                            canClearSelection={false}
                            value={
                              input.value
                                ? new Date(input.value)
                                : null
                            }
                            popoverProps={{
                              targetClassName: 'w-100',
                            }}
                            maxDate={moment().add(10, 'y').toDate()}
                            minDate={new Date()}
                            placeholder="Deadline"
                            className="flex-auto"
                          />
                        </div>
                        {checkError(meta) && (
                          <small
                            className="mv3-ns mv2"
                            style={{ color: 'red' }}
                          >
                            {meta.error || meta.submitError}
                          </small>
                        )}
                      </div>
                    )}
                  />
                </div>
              )}
              <Field<string>
                name="color"
                render={({ input, meta }) => (
                  <div className="mb3 mt3">
                    <p
                      className="fw5 mb3"
                      style={{ fontSize: '.8rem' }}
                    >
                      Label
                    </p>
                    <div className="flex">
                      {Color.map((color) => (
                        <div className="pr2" key={color.code}>
                          <Icon
                            className="br2"
                            icon={
                              isEqual(color.code, labelColor) === true
                                ? 'tick'
                                : 'blank'
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              input.onChange(color.code);
                              setLabelColor(color.code);
                            }}
                            style={{
                              backgroundColor: color.value,
                              border:
                                isEqual(color.code, labelColor) ===
                                true
                                  ? '3px solid #ffffff'
                                  : 'none',
                              height: '3rem',
                              padding: '0.8rem',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              />
              <div className="flex justify-end mt4">
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
                  text="Create"
                />

                <Button
                  className="w4 grow h2 pointer br0"
                  style={{
                    background: 'white',
                    outline: 'none',
                    color: 'black',
                  }}
                  onClick={(e: any) => {
                    e.preventDefault();
                    props.setShowProjectDialog(false);
                  }}
                  text="Cancel"
                />
              </div>
            </div>
          </form>
        )}
      />
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    departments: state.companyReducer.currentCompany.departments,
    company: state.companyReducer.currentCompany,
    associates: state.associateReducer.associatesList,
  };
};

export const FormProject = connect(mapStateToProps, {
  createProjectInCompany,
  getAllDepartments,
})(FormComponent);
