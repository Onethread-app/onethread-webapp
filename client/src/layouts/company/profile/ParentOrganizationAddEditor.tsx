import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { ICompany } from 'stores/company/Reducer';
import {
  addOrganization,
  getCompanyDetails,
} from 'stores/company/Actions';

import { checkError, maxValue } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';

interface IOrganizationEditProps {
  setShowDialog: (val: boolean) => void;
  addOrganization: (parentcom: {}) => any;
  getCompanyDetails: (companyName: string) => void;
  company: ICompany;
  isLoading: boolean;
}

const OrganizationAddComponent = (props: IOrganizationEditProps) => {
  // useEffect(() => {
  //   async function loadOrganization(getCompanyDetails: (companyName: string) => void) {
  //     await getCompanyDetails(props.company.name);
  //   }
  //   loadOrganization(props.getCompanyDetails);
  // }, []);

  const onSubmit = async (values: any) => {
    const response = await props.addOrganization(values);
    if (response && props.isLoading === false) {
      props.setShowDialog(false);
    }
  };

  return (
    <>
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
                  background: '#08A0F7',
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
                  border: '1px solid #08A0F7',
                  color: '#08A0F7',
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

export const OrganizationAdd = connect(mapStateToProps, {
  addOrganization,
  getCompanyDetails,
})(OrganizationAddComponent);
