import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SubmitError } from 'components/final-form/SubmitError';
import {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
} from 'stores/company/Actions';
import {
  refreshUserInfoStart,
  updateUserAuthInfoStart,
  verifyUserTokenStart,
} from 'stores/user/Actions';

import {
  composeValidators,
  maxValue,
  passwordValidation,
  required,
} from 'components/final-form/utils';
import { isValidEmail } from 'helpers/utils';

import OnethreadLogo from '../../resources/images/onethread-text.png';
import {
  Container,
  FormContainer,
  ImageContainer,
  Logo,
} from './Index.styles';
import {
  StyledTextInput,
  StyledButton,
} from '../../components/form-components/Index.styles';
import { Toaster } from '@blueprintjs/core';
import { CircularProgress } from '@material-ui/core';
// import { TOKEN_VERIFY_START } from 'stores/user/Types';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

interface IProps {
  currentCompany: any;
  getCompanyPublicInformation: (arg0: string) => void;
  tokenVerificationProcessing: boolean;
  tokenVerificationError: string;
  requestToJoinCompanyStart: (arg0: string) => void;
  tokenVerified: boolean;
  updateUserAuthInfoStart: (props) => void;
  success: boolean;
  verifyUserTokenStart: (arg0: string) => void;
  updateUserTokenStart: (arg0: string) => void;
  companyJoinRequestFailed: string;
  accountUpdateError: string;
  // accountUpdateSuccess: boolean;
}

const Index = (props: IProps) => {
  const {
    currentCompany,
    getCompanyPublicInformation,
    tokenVerificationProcessing,
    tokenVerificationError,
    requestToJoinCompanyStart,
    tokenVerified,
    updateUserAuthInfoStart,
    success,
    verifyUserTokenStart,
    companyJoinRequestFailed,
    accountUpdateError,
  } = props;
  const history = useHistory();
  const query = useQuery();
  // const dispatch = useDispatch();

  const { t } = useTranslation();

  const emailFromURL =
    query.get('email') ||
    JSON.parse(localStorage.getItem('email')!) ||
    '';
  const token = query.get('token') || '';
  const [email, setEmail] = useState<string>(emailFromURL);
  const [accessToken, setAccessToken] = useState<string>('');
  const [companyToJoin, setCompanyToJoin] = useState<string>(
    JSON.parse(localStorage.getItem('companyToJoin')!) || '',
  );
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: any) => {
    setLoading(true);
    if (accessToken) {
      updateUserAuthInfoStart({
        userInfo: values,
        token: accessToken,
      });
    }
  };

  useEffect(() => {
    setCompanyToJoin(
      JSON.parse(localStorage.getItem('companyToJoin')!) || '',
    );
    if (!tokenVerified) {
      verifyUserTokenStart(token);
    }
    // dispatch({ type: TOKEN_VERIFY_START, payload: token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenVerified, token]);

  useEffect(() => {
    if (tokenVerified && token && companyToJoin) {
      getCompanyPublicInformation(companyToJoin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tokenVerified, companyToJoin, currentCompany]);

  useEffect(() => {
    if (emailFromURL && isValidEmail(emailFromURL)) {
      setEmail(emailFromURL);
    }
    setAccessToken(JSON.parse(localStorage.getItem('ot_access_id')!));
    if (!tokenVerificationProcessing && tokenVerificationError) {
      localStorage.removeItem('ot_refresh_id');
      localStorage.removeItem('ot_access_id');
      history.push('/signup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    emailFromURL,
    tokenVerified,
    tokenVerificationError,
    tokenVerificationProcessing,
  ]);

  useEffect(() => {
    if (success && companyToJoin && currentCompany.name !== '') {
      setLoading(false);
      refreshUserInfoStart();
      requestToJoinCompanyStart(currentCompany._id);
      if (localStorage.removeItem('email')!) {
        localStorage.removeItem('email');
      }
      localStorage.removeItem('companyToJoin');
      history.push('/');
    }
    if (success && !companyToJoin) {
      refreshUserInfoStart();
      history.push('/create-company');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyToJoin, currentCompany, success]);

  useEffect(() => {
    setError(
      tokenVerificationError ||
        accountUpdateError ||
        companyJoinRequestFailed ||
        '',
    );
    if (companyJoinRequestFailed) {
      setLoading(false);
      Toaster.create().show({
        message:
          'There was an error while trying to join the company',
        intent: 'danger',
        timeout: 3000,
      });
    }
    if (error === '') {
      setLoading(false);
    }
  }, [
    accountUpdateError,
    companyJoinRequestFailed,
    error,
    tokenVerificationError,
  ]);

  return (
    <Container>
      <FormContainer item xs={6} className="grid-item item1">
        <Logo to="/">
          One<span>Thread</span>
        </Logo>
        <header className="welcome">Welcome to Onethread!</header>
        {companyToJoin !== '' ? (
          <p>You are joining {currentCompany?.name}</p>
        ) : (
          <p>You are signing up as {email}</p>
        )}
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
            <form onSubmit={handleSubmit} className="form">
              <SubmitError errorMessage={submitError || error} />
              <label>What's your first name?</label>
              <Field
                name="firstName"
                placeholder="Felipe"
                parse={(value) =>
                  value.replace(/[^A-Za-z ]/gi, '').trim()
                }
                validate={composeValidators(required, maxValue(32))}
                render={(inputProps) => (
                  <StyledTextInput {...inputProps} />
                )}
              />
              <label>What's your last name?</label>
              <Field
                name="lastName"
                placeholder="Castro"
                parse={(value) =>
                  value.replace(/[^A-Za-z ]/gi, '').trim()
                }
                validate={composeValidators(required, maxValue(32))}
                render={(inputProps) => (
                  <StyledTextInput {...inputProps} />
                )}
              />
              <label>Please set a password</label>
              <Field
                name="password"
                type="password"
                palceholder="********"
                validate={composeValidators(
                  required,
                  passwordValidation,
                )}
                render={(inputProps) => (
                  <StyledTextInput {...inputProps} />
                )}
              />
              <p>
                Password must be 8 characters or longer and contain at
                least a number, an uppercase letter, a lowercase
                letter and a special character.
              </p>
              <StyledButton>
                {loading ? <CircularProgress /> : 'Continue'}
              </StyledButton>
            </form>
          )}
        />
        <p className="wrong-email">
          Wrong account?{' '}
          <Link to="/signin" className="link">
            Log in
          </Link>
        </p>
      </FormContainer>
      <ImageContainer>
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
  errorGettingCompanyDetails:
    state.companyReducer.errorOnGettingCompanyDetails,
  tokenVerificationProcessing: state.userReducer.tokenVerification,
  tokenVerificationError: state.userReducer.tokenVerificationError,
  tokenVerified: state.userReducer.tokenVerifiedSuccess,
  currentCompany: state.companyReducer.currentCompany,
  success: state.userReducer.tokenRefreshedSuccess,
  companyJoinRequestFailed:
    state.companyReducer.companyJoinRequestFailed,
  companyJoinRequestSuccess: state.companyReducer.companyJoinSuccess,
  accountUpdateError: state.userReducer.accountUpdateError,
});

export default connect(mapStateToProps, {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
  verifyUserTokenStart,
  updateUserAuthInfoStart,
  refreshUserInfoStart,
})(Index);
