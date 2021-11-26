import { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Field, Form } from 'react-final-form';

import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';

import {
  createCompanyAction,
  clearErrorOnCompanyCreate,
  clearCompanyState,
} from 'stores/company/Actions';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import {
  checkError,
  composeValidators,
  required,
} from 'components/final-form/utils';

import {
  ModalContainer,
  SimpleButton,
  TextInput,
  StyledButton,
} from './CompanySection.styles';

import {
  errorToaster,
  successToaster,
} from 'components/toast/Toaster';

const CompanySignupFormComponent = (
  props: {
    setShowDialog: (val: boolean) => void;
    createCompanyAction: (val: any) => void;
    clearErrorOnCompanyCreate: () => void;
    clearCompanyState: () => void;
    companyCreated: boolean;
    companyName: string;
    creatingCompany: boolean;
    errorOnCreatingCompany: string;
    getAllCompaniesByUserId: (userId: string) => void;
    userId: string;
  } & RouteComponentProps,
) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleCreateCompany = async (values) => {
    setLoading(true);
    setSuccessMessage(`The company ${values.name} has been created`);
    props.createCompanyAction(values);
  };

  useEffect(() => {
    if (
      props.errorOnCreatingCompany === '' &&
      props.creatingCompany === false &&
      props.companyCreated === true
    ) {
      setLoading(false);
      props.setShowDialog(false);
      successToaster(successMessage);
      props.clearCompanyState();
    }
    if (
      props.creatingCompany === false &&
      props.companyCreated === false &&
      props.errorOnCreatingCompany !== ''
    ) {
      setLoading(false);
      errorToaster(returnErrorText(props.errorOnCreatingCompany));
      props.clearErrorOnCompanyCreate();
    }
  }, [
    props.errorOnCreatingCompany,
    props.creatingCompany,
    props.companyCreated,
  ]);

  return (
    <ModalContainer>
      <h1 className="f5 lh-title mb1">
        {t('app.forms.Create-company.Create')}
      </h1>
      <Form
        onSubmit={handleCreateCompany}
        validate={(values: any) => {
          const errors = {} as any;
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
          <form onSubmit={handleSubmit}>
            <Field<string>
              name="name"
              type="text"
              validate={composeValidators(required)}
              render={({ input, meta }) => (
                <div className="flex justify-start items-center mt3 mb3">
                  <label className="">Name</label>
                  <TextInput
                    {...input}
                    placeholder="Required"
                    hasError={
                      checkError(meta) &&
                      (meta.error || meta.submitError)
                    }
                  />
                </div>
              )}
            />
            <Field<string>
              name="email"
              type="email"
              parse={(value: string) =>
                value.replaceAll(
                  /[^A-Za-z0-9!#$%&'*+-/=?^_`{|}~."(),:;<>@[\]]/gi,
                  '',
                )
              }
              render={({ input, meta }) => (
                <div className="flex justify-start items-center mt3 mb3">
                  <label className="">Email Address</label>
                  <TextInput
                    {...input}
                    value={input.value ?? ''}
                    placeholder="Company email address"
                  />
                </div>
              )}
            />
            <Field<string>
              name="address"
              type="text"
              render={({ input, meta }) => (
                <div className="flex justify-start items-center mb3">
                  <label className="">Address</label>
                  <TextInput
                    {...input}
                    value={input.value ?? ''}
                    placeholder="Company address"
                  />
                </div>
              )}
            />

            <div className="flex justify-between">
              <StyledButton
                type="submit"
                className="h2 pointer"
                // style={{
                //   background: '#08A0F7',
                //   outline: 'none',
                //   color: 'white',
                // }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    Creating Company{' '}
                    <Spinner className="ml2" size={15} />
                  </>
                ) : (
                  'Create Company'
                )}
              </StyledButton>
              <SimpleButton
                className="h2 pointer"
                // style={{
                //   background: '#fff',
                //   outline: 'none',
                //   border: '1px solid #08A0F7',
                //   color: '#08A0F7',
                // }}
                onClick={(e: any) => {
                  e.preventDefault();
                  props.setShowDialog(false);
                  setLoading(false);
                }}
              >
                Cancel
              </SimpleButton>
            </div>
          </form>
        )}
      />
    </ModalContainer>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companyName: state.companyReducer.currentCompany.uniqueName,
    creatingCompany: state.companyReducer.creatingCompany,
    companyCreated: state.companyReducer.companyCreated,
    errorOnCreatingCompany:
      state.companyReducer.errorOnCreatingCompany,
    userId: state.userReducer.user._id,
  };
};

export const CompanySignupForm = connect(mapStateToProps, {
  createCompanyAction,
  getAllCompaniesByUserId,
  clearErrorOnCompanyCreate,
  clearCompanyState,
})(withRouter(CompanySignupFormComponent));
