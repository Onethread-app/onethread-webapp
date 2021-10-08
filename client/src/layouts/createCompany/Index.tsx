import { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Field, Form } from 'react-final-form';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SubmitError } from 'components/final-form/SubmitError';
import {
  composeValidators,
  required,
} from 'components/final-form/utils';
import {
  clearCompanyState,
  createCompanyAction,
  getCompanyDetails,
} from 'stores/company/Actions';

import KeyboardBackspace from '@material-ui/icons/KeyboardBackspace';

import { StyledTextInput } from 'components/form-components/Index.styles';

import {
  Container,
  FormContainer,
  ImageContainer,
  Logo,
  TextLink,
  StyledButton,
} from './Index.styles';
import OnethreadLogo from '../../resources/images/onethread-text.png';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchUserAction } from 'stores/auth/Actions';
import SuspenseLoader from 'components/loader/SuspenseLoader';
import useElementSize from 'helpers/hooks/useElementSize';

const Index = ({ user, company, ...props }) => {
  const history = useHistory();
  const [companyName, setCompanyName] = useState<string>('');
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const containerRef = useRef(null);
  const containerSize = useElementSize(containerRef);

  const onSubmit = async (values: { name: string }) => {
    setLoading(true);
    const companyData = {
      name: values.name,
      legalOwnerMail: user?.email,
      legalOwner: user?.firstName + ' ' + user?.lastName,
    };
    localStorage.setItem(
      'currentCompany',
      JSON.stringify(values.name),
    );
    setCompanyName(values.name);
    props.createCompanyAction(companyData);
  };

  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.firstName === '') {
      props.fetchUserAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.firstName]);

  useEffect(() => {
    if (company.errorOnCreatingCompany) {
      setLoading(false);
      setError(returnErrorText(company.errorOnCreatingCompany));
    }
    if (
      !company?.creatingCompany &&
      company.companyCreated &&
      company?.errorOnCreatingCompany === ''
    ) {
      setLoading(false);
      localStorage.setItem(
        'currentCompany',
        JSON.stringify(company?.currentCompany?.name),
      );
      localStorage.setItem(
        'currentCompanyId',
        JSON.stringify(company?.currentCompany?._id)!,
      );
      props.clearCompanyState();
      history.push('/add-members');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    company.companyCreated,
    company.createCompanyAction,
    company?.creatingCompany,
    company.errorOnCreating,
    company?.errorOnCreatingCompany,
    company.uniqueName,
    companyName,
  ]);

  return props?.user?.firstName === '' ? (
    <SuspenseLoader />
  ) : (
    <Container ref={containerRef}>
      <FormContainer>
        <Logo to="/">
          One<span>Thread</span>
        </Logo>
        <TextLink
          to="#"
          onClick={() => {
            history.push('/user-info');
          }}
        >
          <KeyboardBackspace />
          Back
        </TextLink>
        <header>Hi {user?.firstName + ' ' + user?.lastName}</header>
        <p>Let's set up your workspace</p>
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
            <form onSubmit={handleSubmit}>
              <SubmitError errorMessage={submitError || error} />
              <label>What's your company's' name?</label>
              <Field
                name="name"
                placeholder="Google Inc."
                validate={composeValidators(required)}
                parse={(value) =>
                  value.replaceAll(/[^A-Za-z0-9 ]/gi, '')
                }
                render={(inputProps) => (
                  <StyledTextInput {...inputProps} />
                )}
              />
              <StyledButton type="submit">
                {loading ? (
                  <CircularProgress size="1rem" />
                ) : (
                  'Continue'
                )}
              </StyledButton>
            </form>
          )}
        />
        <div>
          <p>
            Do you want to join a company already created?{' '}
            <Link to="/search-company">Search company</Link>
          </p>
        </div>
      </FormContainer>
      <ImageContainer height={containerSize.height}>
        <Logo to="/">
          <img src={OnethreadLogo} alt="Onethread logo" />
        </Logo>
        <h3>
          {t('landing.login.about-one-thread-login.content-login')}
        </h3>
      </ImageContainer>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
  company: state.companyReducer,
});

export default connect(mapStateToProps, {
  createCompanyAction,
  fetchUserAction,
  getCompanyDetails,
  clearCompanyState,
})(Index);
