import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { checkError, maxValue } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
import { addOrganization, getCompanyDetails } from 'stores/company/Actions';
import { ICompany } from 'stores/company/Reducer';

interface IOrganizationEditProps {
  setShowDialog: (val: boolean) => void;
  addOrganization: (parentcom: {}) => any;
  getCompanyDetails: (companyName: string) => void;
  company: ICompany;
}

const OrganizationEditComponent = (props: IOrganizationEditProps) => {

  useEffect(() => {
    async function loadOrganization(getCompanyDetails: (companyName: string) => void) {
      await getCompanyDetails(props.company.name);
    }
    loadOrganization(props.getCompanyDetails);
  }, []);

  const onSubmit = async (values: any) => {
    window.alert(JSON.stringify(values, null, 2));
    const response = await props.addOrganization(values);
    if (response === 201) {
      props.setShowDialog(false);
    }
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
          <form
            className="ph4 pt6"
            onSubmit={handleSubmit}
          >
            <SubmitError errorMessage={submitError} />
            <h1 className="f5 lh-copy white pb4">Parent Organizations</h1>
            <Field<string>
              name="parentcom"
              validate={maxValue(32)}
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>Company Name</label>
                  <InputGroupFieldWithError
                    id="parentcom"
                    className="mt1 ba"
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
const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  };
};

export const OrganizationEdit = connect(mapStateToProps, {
  addOrganization, getCompanyDetails
})(OrganizationEditComponent);