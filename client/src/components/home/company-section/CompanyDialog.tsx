import { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';

import {
  createCompanyAction,
  clearErrorOnCompanyCreate,
} from 'stores/company/Actions';

import {
  ModalContainer,
  SimpleButton,
  TextInput,
  StyledButton,
} from './CompanySection.styles';
import { Field, Form } from 'react-final-form';
import {
  checkError,
  composeValidators,
  required,
} from 'components/final-form/utils';

const CompanySignupFormComponent = (
  props: {
    setShowDialog: (val: boolean) => void;
    createCompanyAction: (val: any) => void;
    clearErrorOnCompanyCreate: () => void;
    companyName: string;
    creatingCompany: boolean;
    errorOnCreatingCompany: string;
    useToaster: () => any;
  } & RouteComponentProps,
) => {
  const { t } = useTranslation();
  const [currentCompanyName, setCurrentCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const { setShowToaster, setErrorMessage, setSuccessMessage } =
    props.useToaster();

  const handleCreateCompany = async (values) => {
    setLoading(true);
    await props.createCompanyAction(values);
    setSuccessMessage(`The company ${values.name} has been created`);
  };

  useEffect(() => {
    setCurrentCompanyName(props.companyName);
    return () => {
      props.clearErrorOnCompanyCreate();
    };
  }, []);

  useEffect(() => {
    if (
      loading &&
      props.creatingCompany === false &&
      props.errorOnCreatingCompany === '' &&
      props.companyName !== currentCompanyName
    ) {
      setErrorMessage('');
      setShowToaster(true);
      setLoading(false);
      props.setShowDialog(false);
      //   props.history.push(`/company/${props.companyName}/dashboard`);
    }
  }, [props.creatingCompany]);

  useEffect(() => {
    if (props.errorOnCreatingCompany) {
      setLoading(false);
      setSuccessMessage('');
      setErrorMessage(props.errorOnCreatingCompany);
      setShowToaster(true);
    }
  }, [props.errorOnCreatingCompany]);

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
                    placeholder="Company Name (required)"
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
                  <input
                    {...input}
                    value={input.value ?? ''}
                    style={{
                      width: '100%',
                      boxShadow:
                        'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '0.2rem',
                    }}
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
                  <input
                    {...input}
                    value={input.value ?? ''}
                    style={{
                      width: '100%',
                      boxShadow:
                        'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '0.2rem',
                    }}
                    placeholder="Company address"
                  />
                </div>
              )}
            />

            <div className="flex justify-end">
              <SimpleButton
                className="w4 grow h2 pointer mr3"
                style={{
                  background: '#fff',
                  outline: 'none',
                  border: '1px solid #34b3e9',
                  color: '#34b3e9',
                }}
                onClick={(e: any) => {
                  e.preventDefault();
                  props.setShowDialog(false);
                  setLoading(false);
                }}
              >
                cancel
              </SimpleButton>
              <StyledButton
                type="submit"
                className="w4 grow h2 pointer"
                style={{
                  background: '#34b3e9',
                  outline: 'none',
                  color: 'white',
                }}
                disabled={loading}
              >
                {loading ? <Spinner size={15} /> : 'Save'}
              </StyledButton>
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
    errorOnCreatingCompany:
      state.companyReducer.errorOnCreatingCompany,
  };
};

export const CompanySignupForm = connect(mapStateToProps, {
  createCompanyAction,
  clearErrorOnCompanyCreate,
})(withRouter(CompanySignupFormComponent));
