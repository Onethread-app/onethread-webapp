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
import { updateProject } from '../../../stores/project/Actions';

import { Color } from 'stores/UtilsActions';
import { isEqual } from 'lodash';
import { DateInput } from '@blueprintjs/datetime';
interface UpdateProjectProps {
  setShowDialog: (val: boolean) => void;
  projectId: string;
  projectName: string;
  color: string;
}

interface UpdateProjectInternalProps extends UpdateProjectProps {
  updateProject: (
    name: string,
    projectId: string,
    color: string,
    deadline: Date,
  ) => any;
  isLoading: boolean;
  updatingProject: boolean;
  errorOnUpdatingProject: string;
}

const UpdateProjectComponent = (
  props: UpdateProjectInternalProps,
) => {
  const [labelColor, setLabelColor] = useState(null as any);
  const onSubmit = async (values: any) => {
    await props.updateProject(
      values.name,
      props.projectId,
      values.color,
      values.deadline,
    );
    if (
      props.updatingProject === false &&
      props.errorOnUpdatingProject === ''
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
            name="deadline"
            render={({ input, meta }) => (
              <div>
                <p className="fw5 mb3" style={{ fontSize: '.8rem' }}>
                  Deadline
                </p>
                <div className={`flex bw1 pb1 br0 items-center `}>
                  <div>
                    <Icon
                      icon="calendar"
                      className="mr2"
                      style={{ color: '#3F61C5' }}
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
                    value={input.value ? new Date(input.value) : null}
                    popoverProps={{
                      targetClassName: 'w-100',
                    }}
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
          <Field<string>
            name="color"
            render={({ input, meta }) => (
              <div className="mb3 mt3">
                <p className="fw5 mb3" style={{ fontSize: '.8rem' }}>
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
                            isEqual(color.code, labelColor) === true
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
    updatingProject: state.projectReducer.updatingProject,
    errorOnUpdatingProject:
      state.projectReducer.errorOnUpdatingProject,
  };
};

export const UpdateProject = connect(mapStateToProps, {
  updateProject,
})(UpdateProjectComponent);
