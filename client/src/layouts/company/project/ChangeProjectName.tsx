import { Divider, Button, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import {
  checkError,
  maxValue,
  composeValidators,
  required,
} from 'components/final-form/utils';
import { SubmitError } from 'components/final-form/SubmitError';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import { updateProjectName } from '../../../stores/project/Actions';

import { Color } from 'stores/UtilsActions';
import { isEqual } from 'lodash';
interface ChangeNameProps {
  setShowDialog: (val: boolean) => void;
  projectId: string;
  projectName: string;
  color: string;
}

interface ChangeNameInternalProps extends ChangeNameProps {
  updateProjectName: (
    name: string,
    projectId: string,
    color: string,
  ) => any;
  isLoading: boolean;
  updatingProjectName: boolean;
  errorOnUpdatingProjectName: string;
}

const ChangeNameComponent = (props: ChangeNameInternalProps) => {
  const [labelColor, setLabelColor] = useState(null as any);
  const onSubmit = async (values: any) => {
    await props.updateProjectName(
      values.name,
      props.projectId,
      values.color,
    );
    if (
      props.updatingProjectName === false &&
      props.errorOnUpdatingProjectName === ''
    ) {
      props.setShowDialog(false);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        name: props.projectName,
        color: props.color,
      }}
      render={
        
        ({
        handleSubmit,
        form,
        submitting,
        pristine,
        values,
        submitError,
        hasValidationErrors,
        ...rest
      }) => (
        <form className="fl w-100 ph4 pt6" onSubmit={handleSubmit}>
          <SubmitError errorMessage={submitError} />
          <Field<string>
            name="name"
            validate={composeValidators(required, maxValue(32))}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
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
                  label="Project Name*"
                />

              </div>
            )}
          />
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
          <Divider />
          <div className="flex justify-end">
               <Button
              className="w4 grow h2 pointer mr3"
              style={{
                background: '#0fa3a3',
                outline: 'none',
                color: 'white',
              }}
              loading={submitting}
              type="submit"
              disabled={submitting || pristine}
              text="save"
            />
            <Button
              className="w4 grow h2 pointer br0"
              style={{
                background: '#fff',
                outline: 'none',
                border: '1px solid #3F61C5',
                color: '#3F61C5',
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
    isLoading: state.projectReducer.projectLoading,
    updatingProjectName: state.projectReducer.updatingProjectName,
    errorOnUpdatingProjectName:
      state.projectReducer.errorOnUpdatingProjectName,
  };
};

export const ChangeName = connect(mapStateToProps, {
  updateProjectName,
})(ChangeNameComponent);
