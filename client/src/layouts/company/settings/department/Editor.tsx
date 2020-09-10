import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { addDepartment } from 'stores/company/Actions';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { checkError, maxValue } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';

interface DepartmentEditorProps {
  setShowDialog: (val: boolean) => void;
}
interface DepartmentEditorInternalProps
  extends DepartmentEditorProps {
  addDepartment: (val: string) => any;
  isCompanyLoading: boolean;
}

const DepartmentEditorComponent = (
  props: DepartmentEditorInternalProps,
) => {
  const onSubmit = async (values: any) => {
    const response = await props.addDepartment(values.name);
    if (response && props.isCompanyLoading === false) {
      props.setShowDialog(false);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
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
        <form className="ph4 pv2" onSubmit={handleSubmit}>
          <h1 className="f5 lh-copy tigrow-lightBlue">
            Add Departments
          </h1>
          <div className="mw9 center mb2">
            <SubmitError errorMessage={submitError} />
          </div>
          <Field<string>
            name="name"
            validate={maxValue(32)}
            render={({ input, meta }) => (
              <div className={`${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <InputGroupFieldWithError
                  id="name"
                  placeHolder="Add Department"
                  className={`bb ${
                    checkError(meta) ? 'b--red' : 'b--lightBlue'
                  }`}
                  value={input.value}
                  onChange={input.onChange}
                  leftIcon="comparison"
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
    isCompanyLoading: state.companyReducer.loading,
  };
};
export const DepartmentEditor = connect(mapStateToProps, { addDepartment })(
  DepartmentEditorComponent,
);
