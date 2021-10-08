import { useEffect, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  checkError,
  composeValidators,
  required,
} from 'components/final-form/utils';
import {
  userChangeEmailStart,
  userClearState,
  userSignupStart,
} from 'stores/auth/Actions';

import OnethreadLogo from '../../resources/images/onethread-text.png';

import {
  Container,
  FormContainer,
  ImageContainer,
  Logo,
  Row,
  StyledButton,
} from './Index.styles';
import { StyledError } from '../../components/form-components/Index.styles';
import { CircularProgress } from '@material-ui/core';
import useElementSize from 'helpers/hooks/useElementSize';

interface IProps {
  userSignupStart: (arg0: string) => void;
  signupLoading: boolean;
  error: string;
  changeEmailLoading: boolean;
  changeEmailFailure: string;
  userChangeEmailStart: (arg0: string, arg1: string) => void;
  userClearState: () => void;
}

const Index = (props: IProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const location = useLocation<any>();
  const [oldEmail, setOldEmail] = useState<string>('');
  const [changeEmail, setChangeEmail] = useState<boolean>(false);

  const containerRef = useRef(null);
  const containerSize = useElementSize(containerRef);

  const handleSignup = (values: { email: string }) => {
    setLoading(true);
    changeEmail
      ? props.userChangeEmailStart(
          values.email,
          JSON.parse(localStorage.getItem('id')!),
        )
      : props.userSignupStart(values.email);
    localStorage.setItem('email', JSON.stringify(values.email));
  };

  useEffect(() => {
    if (location.state) {
      setChangeEmail(location.state?.changeEmail || false);
      setOldEmail(location.state?.oldEmail || '');
    }
  }, [location.state]);

  useEffect(() => {
    if (
      loading === true &&
      props.signupLoading === false &&
      props.error === ''
    ) {
      setLoading(false);
      props.userClearState();
      history.push('/signup-confirmation');
    }
    if (
      loading === true &&
      props.signupLoading === false &&
      props.error !== ''
    ) {
      setLoading(false);
      setError(props.error);
    }
    if (
      loading === true &&
      props.changeEmailLoading === false &&
      props.changeEmailFailure === ''
    ) {
      setLoading(false);
      props.userClearState();
      history.push('/signup-confirmation');
    }
    if (
      loading === true &&
      props.changeEmailLoading === false &&
      props.changeEmailFailure !== ''
    ) {
      setLoading(false);
      setError(props.changeEmailFailure);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loading,
    props.error,
    props.signupLoading,
    props.changeEmailFailure,
    props.changeEmailLoading,
  ]);

  return (
    <Container ref={containerRef}>
      <FormContainer item xs={6}>
        <Logo to="/">
          One<span>Thread</span>
        </Logo>
        <header className="welcome">Welcome to Onethread!</header>
        <Form
          onSubmit={handleSignup}
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
              <label>Create an account now, it’s free!</label>
              <Field
                name="email"
                type="email"
                validate={composeValidators(required)}
                defaultValue={oldEmail}
                render={({ input, meta }) => {
                  return (
                    <>
                      <Row>
                        <input
                          {...input}
                          placeholder="Please provide your email address"
                        />
                        <StyledButton type="submit">
                          {loading ? (
                            <>
                              <CircularProgress
                                size="1rem"
                                className="mr1"
                              />
                              <span>
                                {`${
                                  changeEmail
                                    ? 'Change Email'
                                    : 'Sign up'
                                }
                                `}
                              </span>
                            </>
                          ) : (
                            `${
                              changeEmail ? 'Change Email' : 'Sign up'
                            }`
                          )}
                        </StyledButton>
                      </Row>
                      {(checkError(meta) || error !== '') && (
                        <StyledError
                          errorMessage={
                            meta.error || meta.submitError || error
                          }
                        />
                      )}
                    </>
                  );
                }}
              />
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
  signupLoading: state.authReducer?.signupLoading,
  error: state.authReducer?.signupError,
  changeEmailLoading: state.authReducer?.changeEmailLoading,
  changeEmailFailure: state.authReducer?.changeEmailFailure,
});

export default connect(mapStateToProps, {
  userSignupStart,
  userChangeEmailStart,
  userClearState,
})(Index);
