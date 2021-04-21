import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { checkError, maxValue } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
import {
  editOrganization,
  getCompanyDetails,
} from 'stores/company/Actions';
import { ICompany, IOrg } from 'stores/company/Reducer';

interface IOrganizationEditProps {
  setShowDialog: (val: boolean) => void;
  editOrganization: (parentcom: {}, organization: number) => any;
  getCompanyDetails: (companyName: string) => void;
  company: ICompany;
  org: IOrg;
  isLoading: boolean;
}

const OrganizationEditEditorComponent = (props: IOrganizationEditProps) => {

  const onSubmit = async (values: any) => {
    const response = await props.editOrganization(values, props.org.ind);
    if (response && props.isLoading === false) {
      props.setShowDialog(false);
    }
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          parentcom: props.org.name,
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
          <form className="ph4 pt6" onSubmit={handleSubmit}>
            <SubmitError errorMessage={submitError} />
            <h1 className="f5 lh-copy white pb4">
              Parent Organizations
            </h1>
            <Field<string>
              name="parentcom"
              validate={maxValue(32)}
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <label>Company Name</label>
                  <InputGroupFieldWithError
                    id="parentcom"
                    className="mt1 ba"
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
            <div className="flex justify-end">
            <Button
                className="w4 grow h2 pointer mr3"
                style={{
                  background: '#3F61C5',
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
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    isLoading: state.companyReducer.loading,
  };
};

export const OrganizationEditEditor = connect(mapStateToProps, {
  editOrganization,
  getCompanyDetails,
})(OrganizationEditEditorComponent);
