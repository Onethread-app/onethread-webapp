import { useEffect, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useBeforeunload } from 'react-beforeunload';
import { History } from 'history';

import { SubmitError } from 'components/final-form/SubmitError';
import {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
} from 'stores/company/Actions';
import {
  updateUserAuthInfoStart,
  updateUserInfoAction,
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
import { CircularProgress } from '@material-ui/core';
import { isAuthenticate } from 'stores/UtilsActions';
import { fetchUserAction, logoutAction } from 'stores/auth/Actions';
import useElementSize from 'helpers/hooks/useElementSize';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

interface IProps {
  currentCompany: any;
  getCompanyPublicInformation: (arg0: string) => void;
  requestToJoinCompanyStart: (arg0: string) => void;
  updateUserAuthInfoStart: (props) => void;
  companyJoinRequestFailure: string;
  companyJoinRequestLoading: boolean;
  accountUpdateError: string;
  userClearState: () => void;
  fetchUserAction: () => void;
  user: any;
  updateUserInfoAction: (val: any) => any;
  accountUpdateLoading: boolean;
  logoutAction: (history: History) => void;
}

const Index = (props: IProps) => {
  const {
    currentCompany,
    getCompanyPublicInformation,
    requestToJoinCompanyStart,
    updateUserAuthInfoStart,
    companyJoinRequestFailure,
    companyJoinRequestLoading,
    accountUpdateError,
    fetchUserAction,
    userClearState,
    user,
    updateUserInfoAction,
    accountUpdateLoading,
    logoutAction,
  } = props;
  const history = useHistory();
  const query = useQuery();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [infoUpdated, setInfoUpdated] = useState<boolean>(false);

  const containerRef = useRef(null);
  const containerSize = useElementSize(containerRef);

  const { t } = useTranslation();

  const emailFromURL =
    query.get('email') ||
    JSON.parse(localStorage.getItem('email')!) ||
    '';
  const token = query.get('token') || '';
  const [email, setEmail] = useState<string>(emailFromURL);
  const [companyToJoin, setCompanyToJoin] = useState<string>(
    JSON.parse(localStorage.getItem('companyToJoin')!) || '',
  );
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: any) => {
    setLoading(true);
    setInfoUpdated(true);
    updateUserAuthInfoStart({
      userInfo: values,
      token,
    });
  };

  const updateUserInformation = async (values: any) => {
    setLoading(true);
    setInfoUpdated(true);
    const userInfoReUpdated = updateUserInfoAction(values);
    if (userInfoReUpdated) {
      history.push('/create-company');
    }
  };

  const handleLeave = () => {
    localStorage.removeItem('email');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (isAuthenticate()) {
      fetchUserAction();
    }
  }, []);

  useEffect(() => {
    if (companyToJoin) {
      getCompanyPublicInformation(companyToJoin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (emailFromURL && isValidEmail(emailFromURL)) {
      setEmail(emailFromURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFromURL]);

  useEffect(() => {
    if (infoUpdated) {
      if (
        companyJoinRequestLoading === false &&
        companyJoinRequestFailure === ''
      ) {
        history.push('/');
      }
      setError(accountUpdateError || companyJoinRequestFailure || '');
      if (companyJoinRequestFailure) {
        history.push('/');
      }
      if (error) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accountUpdateError,
    companyJoinRequestFailure,
    companyJoinRequestLoading,
    error,
    infoUpdated,
  ]);

  useEffect(() => {
    if (infoUpdated) {
      if (
        accountUpdateLoading === false &&
        accountUpdateError === ''
      ) {
        if (companyToJoin) {
          requestToJoinCompanyStart(currentCompany._id);
          fetchUserAction();
          userClearState();
        }
        if (!companyToJoin) {
          fetchUserAction();
          userClearState();
          history.push('/create-company');
        }
      }
      if (
        accountUpdateLoading === false &&
        accountUpdateError !== ''
      ) {
        setError(accountUpdateError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    companyToJoin,
    currentCompany._id,
    infoUpdated,
    accountUpdateLoading,
  ]);

  return (
    <Container>
      <FormContainer
        item
        xs={6}
        className="grid-item item1"
        ref={containerRef}
      >
        <Logo to="#" onClick={handleLeave}>
          One<span>Thread</span>
        </Logo>
        <header className="welcome">Welcome to Onethread!</header>
        {user.isAccountVerified ? (
          <>
            <p>Do you want to change your information?</p>

            <Form
              onSubmit={updateUserInformation}
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
                  <label>Your first name</label>
                  <Field
                    name="firstName"
                    placeholder={user?.firstName}
                    parse={(value) =>
                      value.replace(/[^A-Za-z ]/gi, '')
                    }
                    validate={composeValidators(
                      required,
                      maxValue(32),
                    )}
                    defaultValue={user?.firstName}
                    render={(inputProps) => (
                      <StyledTextInput {...inputProps} />
                    )}
                  />
                  <label>Your last name</label>
                  <Field
                    name="lastName"
                    placeholder={user?.lastName}
                    parse={(value) =>
                      value.replace(/[^A-Za-z ]/gi, '')
                    }
                    validate={composeValidators(
                      required,
                      maxValue(32),
                    )}
                    defaultValue={user?.lastName}
                    render={(inputProps) => (
                      <StyledTextInput {...inputProps} />
                    )}
                  />
                  <StyledButton className="mt3">
                    {loading ? (
                      <>
                        <CircularProgress
                          size="1rem"
                          className="mr1"
                        />
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
              Switch account?{' '}
              <Link
                to="#"
                onClick={() => {
                  logoutAction(history);
                  localStorage.removeItem('email');
                  history.push('/signin');
                }}
                className="link"
              >
                Log in
              </Link>
            </p>
          </>
        ) : (
          <>
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
                      value.replace(/[^A-Za-z ]/gi, '')
                    }
                    validate={composeValidators(
                      required,
                      maxValue(32),
                    )}
                    defaultValue={user?.firstName}
                    render={(inputProps) => (
                      <StyledTextInput {...inputProps} />
                    )}
                  />
                  <label>What's your last name?</label>
                  <Field
                    name="lastName"
                    placeholder="Castro"
                    parse={(value) =>
                      value.replace(/[^A-Za-z ]/gi, '')
                    }
                    validate={composeValidators(
                      required,
                      maxValue(32),
                    )}
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
                        <div>
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
                            errorMessage={
                              meta.error || meta.submitError
                            }
                          />
                        ) : (
                          <p>
                            Password must be 8 characters or longer
                            and contain at least:
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
                        <CircularProgress
                          size="1rem"
                          className="mr1"
                        />
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
          </>
        )}
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
  currentCompany: state.companyReducer.currentCompany,
  companyJoinRequestFailure:
    state.companyReducer.companyJoinRequestFailure,
  companyJoinRequestLoading:
    state.companyReducer.companyJoinRequestLoading,
  accountUpdateError: state.userReducer.accountUpdateError,
  accountUpdateLoading: state.userReducer.accountUpdateLoading,
  user: state.userReducer.user,
});

export default connect(mapStateToProps, {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
  verifyUserTokenStart,
  updateUserAuthInfoStart,
  fetchUserAction,
  userClearState,
  updateUserInfoAction,
  logoutAction,
})(Index);
