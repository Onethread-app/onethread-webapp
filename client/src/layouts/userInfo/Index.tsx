import { useEffect, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useBeforeunload } from 'react-beforeunload';

import { SubmitError } from 'components/final-form/SubmitError';
import {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
} from 'stores/company/Actions';
import {
  updateUserAuthInfoStart,
  userClearState,
  verifyUserTokenStart,
} from 'stores/user/Actions';

import {
  checkError,
  composeValidators,
  maxValue,
  passwordValidation,
  required,
} from 'components/final-form/utils';
import { isValidEmail } from 'helpers/utils';

import eyeIcon from './../../resources/images/eye.png';
import eyeClose from './../../resources/images/eyeClose.png';
import OnethreadLogo from '../../resources/images/onethread-text.png';
import {
  Container,
  FormContainer,
  ImageContainer,
  Logo,
  StyledButton,
  TextInput,
} from './Index.styles';
import {
  StyledError,
  // StyledError,
  StyledTextInput,
} from '../../components/form-components/Index.styles';
import { Toaster } from '@blueprintjs/core';
import { CircularProgress } from '@material-ui/core';
import { isAuthenticate } from 'stores/UtilsActions';
import { fetchUserAction } from 'stores/auth/Actions';
import useElementSize from 'helpers/hooks/useElementSize';

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
  tokenRefreshedLoading: boolean;
  tokenRefreshedError: string;
  verifyUserTokenStart: (arg0: string) => void;
  updateUserTokenStart: (arg0: string) => void;
  companyJoinRequestFailure: string;
  accountUpdateError: string;
  userClearState: () => void;
  fetchUserAction: () => void;
  user: any;
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
    tokenRefreshedLoading,
    verifyUserTokenStart,
    companyJoinRequestFailure,
    accountUpdateError,
    tokenRefreshedError,
    fetchUserAction,
    userClearState,
    user,
  } = props;
  const history = useHistory();
  const query = useQuery();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const containerRef = useRef(null);
  const errorRef = useRef(null);
  const containerSize = useElementSize(containerRef);
  // const errorSize = useElementSize(errorRef);

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

  const handleLeave = () => {
    localStorage.removeItem('ot_access_id');
    localStorage.removeItem('ot_refresh_id');
    history.push('/');
  };

  useBeforeunload((e: { preventDefault: () => void }) => {
    if (user?.firstName === '') {
      e.preventDefault();
    }
  });

  useEffect(() => {
    if (!token && !isAuthenticate()) {
      history.push('/');
    }
    setCompanyToJoin(
      JSON.parse(localStorage.getItem('companyToJoin')!) || '',
    );
    if (!tokenVerified && !isAuthenticate()) {
      verifyUserTokenStart(token);
    }
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
    if (
      !tokenRefreshedLoading &&
      tokenRefreshedError === '' &&
      companyToJoin &&
      currentCompany.name !== ''
    ) {
      setLoading(false);
      fetchUserAction();
      requestToJoinCompanyStart(currentCompany._id);
      localStorage.removeItem('email');
      localStorage.removeItem('companyToJoin');
      history.push('/');
    }
    if (
      tokenRefreshedError === '' &&
      !tokenRefreshedLoading &&
      !companyToJoin
    ) {
      fetchUserAction();
      userClearState();
      history.push('/create-company');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    companyToJoin,
    currentCompany,
    tokenRefreshedLoading,
    tokenRefreshedError,
  ]);

  useEffect(() => {
    setError(
      tokenVerificationError ||
        accountUpdateError ||
        companyJoinRequestFailure ||
        '',
    );
    if (companyJoinRequestFailure) {
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
    companyJoinRequestFailure,
    error,
    tokenVerificationError,
  ]);

  return (
    <Container ref={containerRef}>
      <FormContainer item xs={6} className="grid-item item1">
        <Logo to="#" onClick={handleLeave}>
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
                parse={(value) => value.replace(/[^A-Za-z ]/gi, '')}
                validate={composeValidators(required, maxValue(32))}
                defaultValue={user?.firstName}
                render={(inputProps) => (
                  <StyledTextInput {...inputProps} />
                )}
              />
              <label>What's your last name?</label>
              <Field
                name="lastName"
                placeholder="Castro"
                parse={(value) => value.replace(/[^A-Za-z ]/gi, '')}
                validate={composeValidators(required, maxValue(32))}
                defaultValue={user?.lastName}
                render={(inputProps) => (
                  <StyledTextInput {...inputProps} />
                )}
              />
              <label>Please set a password</label>
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                palceholder="********"
                validate={composeValidators(
                  required,
                  passwordValidation,
                )}
                render={({ meta, input, ...rest }) => (
                  <>
                    <div ref={errorRef}>
                      <TextInput {...input} {...rest} />
                      {showPassword ? (
                        <span>
                          <img
                            src={eyeIcon}
                            alt="Show Password"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                          />
                        </span>
                      ) : (
                        <span>
                          <img
                            src={eyeClose}
                            alt="Hide Password"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                          />
                        </span>
                      )}
                    </div>
                    {!meta.active && checkError(meta) ? (
                      <StyledError
                        errorMessage={meta.error || meta.submitError}
                      />
                    ) : (
                      <p>
                        Password must be 8 characters or longer and
                        contain at least:
                        <ul>
                          <li>A number</li>
                          <li>An uppercase letter</li>
                          <li>A lowercase letter</li>
                          <li>A special character</li>
                        </ul>
                      </p>
                    )}
                  </>
                )}
              />
              <StyledButton>
                {loading ? (
                  <>
                    <CircularProgress size="1rem" className="mr1" />
                    <span>Updating info</span>
                  </>
                ) : (
                  'Continue'
                )}
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
      <ImageContainer height={containerSize.height}>
        <Logo to="#" onClick={handleLeave}>
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
  tokenRefreshedLoading: state.userReducer.tokenRefreshedLoading,
  tokenRefreshedError: state.userReducer.tokenRefreshedError,
  companyJoinRequestFailure:
    state.companyReducer.companyJoinRequestFailure,
  accountUpdateError: state.userReducer.accountUpdateError,
  user: state.userReducer.user,
});

export default connect(mapStateToProps, {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
  verifyUserTokenStart,
  updateUserAuthInfoStart,
  fetchUserAction,
  userClearState,
})(Index);
