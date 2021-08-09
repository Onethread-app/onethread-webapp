import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import {
  required,
  checkError,
  composeValidators,
  isEmail,
  passwordValidation,
  maxValue,
} from 'components/final-form/utils';
import {
  Link,
  NavLink,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { Button, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { userSignupAction, UserModel } from 'stores/auth/Actions';
import { isEmpty } from 'lodash';

import { isValidEmail } from 'helpers/utils';

import logo from 'resources/images/onethread-text.png';
import eyeIcon from './../../resources/images/eye.png';
import eyeClose from './../../resources/images/eyeClose.png';
import backgroundImage from './../../resources/images/Bg-png.png';

import { SubmitError } from 'components/final-form/SubmitError';
// import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
// import { allCountryList } from './countryCode';
import InputTooltip from 'components/input-tooltip/InputTooltip';
import './Signup.scss';
import { useTranslation } from 'react-i18next';

const validation = {
  rules: [
    'At least 1 capital letter',
    'At least 1 small letter',
    'At least 1 special character',
    'At least 1 numeric value',
  ],
};
interface SignUpPageInternalProps {
  userSignupAction: (user: UserModel) => any;
}

export const SignUpPageComponent = (
  props: SignUpPageInternalProps & RouteComponentProps,
) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [invited, setInvited] = useState(false);
  // const [countryCode] = useState('+880');

  // const onSelectFlag = (countryCodeA: any) => {
  //   allCountryList.map((country) => {
  //     console.log(country.code === countryCodeA);
  //     country.code === countryCodeA &&
  //       setCountryCode(country.dial_code);
  //   });
  // };

  const onSubmit = async (values: any) => {
    // const reqBody = {
    //   ...values,
    //   contactNo: `${countryCode}-${
    //     values.contactNo ? values.contactNo : '0000'
    //   }`,
    // };

    localStorage.setItem('email', values.email.trim());

    const response = await props.userSignupAction({
      ...values,
      email: values.email.trim(),
      isAccountVerified: invited ? true : false,
    });

    if (response.message === 200 && response.payload.data.token) {
      props.history.push(`/signup-confirmation`);
      return true;
    } else if (response.message === 200) {
      props.history.push('/signin');
      return true;
    }
    return { [response.fieldName]: response.message };
  };

  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const emailFromURL = params.get('email');
    if (emailFromURL) {
      if (isValidEmail(emailFromURL)) {
        setEmail(emailFromURL ? emailFromURL : '');
        setInvited(true);
      }
    }
  }, [props.location.search]);

  const { t } = useTranslation();

  return (
    <div className="cf ph2-ns">
      <div
        className="fl w-100 w-50-ns dt vh-100 ph3 ph0-ns"
        style={{ backgroundColor: 'white' }}
      >
        <div className="v-mid dtc">
          <div className="w-two-thirds-l w-100 center">
            <Form
              onSubmit={onSubmit}
              initialValues={{ email: email ? email : '' }}
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
                <>
                  {/* <h1 className="pl3-ns">Sign Up</h1> */}
                  <h1 className="pl3-ns tigrow-lightBlue">
                    {t('landing.sign-up.sign-up-form.sign-up-text')}
                  </h1>
                  <form onSubmit={handleSubmit}>
                    <div className="mw7 center ph3-ns v-mid">
                      <SubmitError errorMessage={submitError} />

                      <div>
                        <Field<string>
                          name="firstName"
                          validate={composeValidators(
                            required,
                            maxValue(32),
                          )}
                          render={({ input, meta }) => (
                            <div
                              className={` ${
                                checkError(meta)
                                  ? 'mb3-ns mb2'
                                  : 'mb4-ns mb3'
                              }`}
                            >
                              <InputGroupFieldWithError
                                id="firstName"
                                className={`bw1 pb2 br0 bb ${
                                  checkError(meta)
                                    ? 'b--red'
                                    : 'b--lightBlue'
                                }`}
                                value={input.value}
                                onChange={input.onChange}
                                autoFocus={true}
                                leftIcon={
                                  <span className="bp3-icon">
                                    <Icon
                                      icon="mugshot"
                                      style={{ color: '#34b3e9' }}
                                    />
                                  </span>
                                }
                                style={{
                                  boxShadow: 'none',
                                  fontSize: '18px',
                                  paddingLeft: '40px',
                                }}
                                // placeHolder="First Name"
                                placeHolder={t(
                                  'landing.sign-up.sign-up-form.first-name',
                                )}
                                error={
                                  checkError(meta) &&
                                  (meta.error || meta.submitError)
                                }
                              />
                            </div>
                          )}
                        />
                      </div>
                      <div>
                        <Field<string>
                          name="lastName"
                          validate={composeValidators(
                            required,
                            maxValue(32),
                          )}
                          render={({ input, meta }) => (
                            <div
                              className={` ${
                                checkError(meta)
                                  ? 'mb3-ns mb2'
                                  : 'mb4-ns mb3'
                              }`}
                            >
                              <InputGroupFieldWithError
                                id="lastName"
                                className={`bw1 pb2 br0 bb ${
                                  checkError(meta)
                                    ? 'b--red'
                                    : 'b--lightBlue'
                                }`}
                                value={input.value}
                                onChange={input.onChange}
                                autoFocus={true}
                                leftIcon={
                                  <span className="bp3-icon">
                                    <Icon
                                      icon="mugshot"
                                      style={{ color: '#34b3e9' }}
                                    />
                                  </span>
                                }
                                style={{
                                  boxShadow: 'none',
                                  fontSize: '18px',
                                  paddingLeft: '40px',
                                }}
                                // placeHolder="Last Name"
                                placeHolder={t(
                                  'landing.sign-up.sign-up-form.last-name',
                                )}
                                error={
                                  checkError(meta) &&
                                  (meta.error || meta.submitError)
                                }
                              />
                            </div>
                          )}
                        />
                      </div>

                      {/* <div className={`flex justify-content`}>
                        <div style={{ width: '90px' }}>
                          <Field<string>
                            name="countryCode"
                            render={({ input, meta }) => (
                              <div
                                className={` ${
                                  checkError(meta)
                                    ? 'mb3-ns mb2'
                                    : 'mb4-ns mb3'
                                }`}
                              >
                                <ReactFlagsSelect
                                  onSelect={onSelectFlag}
                                  defaultCountry="BD"
                                  showSelectedLabel={false}
                                  selectedSize={20}
                                  // optionsSize={14}
                                />
                              </div>
                            )}
                          />
                        </div>

                        <div style={{ width: '50px' }}>
                          <Field<string>
                            name="countryCode"
                            render={({ input, meta }) => (
                              <div
                                className={` ${
                                  checkError(meta)
                                    ? 'mb3-ns mb2'
                                    : 'mb4-ns mb3'
                                }`}
                              >
                                <InputGroupFieldWithError
                                  id="countryCode"
                                  className={`bw1 pb2 br0 bb ${
                                    checkError(meta)
                                      ? 'b--red'
                                      : 'b--lightBlue'
                                  }`}
                                  onChange={input.onChange}
                                  value={countryCode}
                                  readOnly={true}
                                  style={{
                                    boxShadow: 'none',
                                    fontSize: '12px',
                                  }}
                                />
                              </div>
                            )}
                          />
                        </div>

                        <div className="ml3 ml1-m flex-auto">
                          <div className="w-100">
                            <Field<string>
                              name="contactNo"
                              render={({ input, meta }) => (
                                <div
                                  className={` ${
                                    checkError(meta)
                                      ? 'mb3-ns mb2'
                                      : 'mb4-ns mb3'
                                  }`}
                                >
                                  <InputGroupFieldWithError
                                    id="contactNo"
                                    className={`bw1 pb2 br0 bb ${
                                      checkError(meta)
                                        ? 'b--red'
                                        : 'b--lightBlue'
                                    }`}
                                    value={input.value}
                                    onChange={input.onChange}
                                    style={{
                                      boxShadow: 'none',
                                      fontSize: '18px',
                                    }}
                                    placeHolder="Contact Number"
                                    keypress={(e) => {
                                      if (
                                        e.which < 48 ||
                                        e.which > 57
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      </div> */}
                      <div>
                        {/* <Field<string>
                          name="birthDate"
                          validate={required}
                          render={({ input, meta }) => (
                            <div
                              className={` ${
                                checkError(meta)
                                  ? 'mb3-ns mb2'
                                  : 'mb4-ns mb3'
                              }`}
                            >
                              <div
                                className={`flex bw1 pb1 br0 bb ${
                                  checkError(meta)
                                    ? 'b--red'
                                    : 'b--lightBlue'
                                }`}
                              >
                                <div>
                                  <Icon
                                    icon="calendar"
                                    className="pl2"
                                    style={{ color: '#34b3e9' }}
                                  />
                                </div>
                                <DateInput
                                  className={`  birthdatePicker `}
                                  formatDate={(date: Date) =>
                                    date.toLocaleDateString()
                                  }
                                  parseDate={(str: string) =>
                                    new Date(str)
                                  }
                                  onChange={input.onChange}
                                  canClearSelection={false}
                                  value={
                                    input.value
                                      ? new Date(input.value)
                                      : null
                                  }
                                  popoverProps={{
                                    targetClassName: 'w-100',
                                  }}
                                  minDate={new Date('1934-01-01')}
                                  // placeholder="Birth Date"
                                  placeholder={t('landing.sign-up.sign-up-form.birthday')}
                                  maxDate={moment(new Date())
                                    .subtract(13, 'years')
                                    .toDate()}
                                />
                              </div>
                              {checkError(meta) && (
                                <small
                                  className="mv3-ns mv2"
                                  style={{ color: 'red' }}
                                >
                                  {meta.error || meta.submitError}
                                </small>
                              )}
                            </div>
                          )}
                        /> */}
                      </div>

                      <div>
                        <div>
                          <Field<string>
                            name="email"
                            validate={composeValidators(
                              required,
                              isEmail,
                            )}
                            render={({ input, meta }) => (
                              <div
                                className={` ${
                                  checkError(meta)
                                    ? 'mb3-ns mb2'
                                    : 'mb4-ns mb3'
                                }`}
                              >
                                <InputGroupFieldWithError
                                  id="email"
                                  className={`bw1 pb2 br0 bb ${
                                    checkError(meta)
                                      ? 'b--red'
                                      : 'b--lightBlue'
                                  }`}
                                  value={input.value}
                                  onChange={input.onChange}
                                  autoFocus={true}
                                  leftIcon={
                                    <span className="bp3-icon">
                                      <Icon
                                        icon="envelope"
                                        style={{ color: '#34b3e9' }}
                                      />
                                    </span>
                                  }
                                  style={{
                                    boxShadow: 'none',
                                    fontSize: '18px',
                                    paddingLeft: '40px',
                                  }}
                                  // placeHolder="contact@onethread.app"
                                  placeHolder={t(
                                    'landing.sign-up.sign-up-form.your-email',
                                  )}
                                  error={
                                    checkError(meta) &&
                                    (meta.error || meta.submitError)
                                  }
                                  disabled={isEmpty(email) === false}
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <div>
                          <Field<string>
                            name="password"
                            validate={composeValidators(
                              required,
                              passwordValidation,
                            )}
                            render={({ input, meta }) => (
                              <div
                                className={` ${
                                  checkError(meta)
                                    ? 'mb3-ns mb2'
                                    : 'mb4-ns mb3'
                                }`}
                              >
                                <InputGroupFieldWithError
                                  id="password"
                                  className={`bw1 pb2 br0 bb ${
                                    checkError(meta)
                                      ? 'b--red'
                                      : 'b--lightBlue'
                                  }`}
                                  value={input.value}
                                  onChange={input.onChange}
                                  autoFocus={true}
                                  type={`${
                                    showPassword ? 'text' : 'password'
                                  }`}
                                  leftIcon={
                                    <span className="bp3-icon">
                                      <Icon
                                        icon="lock"
                                        style={{ color: '#34b3e9' }}
                                      />
                                    </span>
                                  }
                                  rightElement={
                                    <span
                                      className="bp3-icon"
                                      style={{
                                        paddingTop: '10px',
                                        paddingRight: '5px',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <img
                                        title={
                                          showPassword
                                            ? `Don't show password`
                                            : 'Show password'
                                        }
                                        onClick={() =>
                                          setShowPassword(
                                            !showPassword,
                                          )
                                        }
                                        src={
                                          showPassword
                                            ? eyeClose
                                            : eyeIcon
                                        }
                                        style={{
                                          width: '15px',
                                          height: '15px',
                                          color: '#34b3e9',
                                          right: '10px',
                                        }}
                                      />
                                      {/* <Tooltip content={
                                          <p style={{ width: '400px' }}>
                                            Password should contain at least 1 capital letter, 1 small letter,
                                            1 special character and 1 numeric value and should be atleast 8 character long!
                                        </p>}
                                          position={Position.TOP_RIGHT}>
                                          <img
                                            src={questionIcon}
                                            width="20px"
                                            height="20px"
                                            color="#34b3e9"
                                          />
                                        </Tooltip> */}
                                      <span
                                        style={{
                                          position: 'absolute',
                                          left: '40px',
                                        }}
                                      >
                                        <InputTooltip
                                          content="Choose a password at least 8 characters long"
                                          direction="right"
                                          validations={validation}
                                        >
                                          <span
                                            role="img"
                                            aria-label="question mark"
                                          >
                                            <img
                                              src="https://svgshare.com/i/Q3c.svg"
                                              alt="question mark logo"
                                              style={{
                                                width: '15px',
                                              }}
                                            />
                                          </span>
                                        </InputTooltip>
                                      </span>
                                    </span>
                                  }
                                  style={{
                                    boxShadow: 'none',
                                    fontSize: '18px',
                                    paddingLeft: '40px',
                                  }}
                                  // placeHolder="Password"
                                  placeHolder={t(
                                    'landing.sign-up.sign-up-form.password',
                                  )}
                                  error={
                                    checkError(meta) &&
                                    (meta.error || meta.submitError)
                                  }
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        className="grow h2 pointer white bp3-minimal w4 btnWidth"
                        style={{
                          background: '#34b3e9',
                          outline: 'none',
                          color: 'white',
                          width: '100%',
                          height: '45px',
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                        }}
                        loading={submitting}
                        type="submit"
                        disabled={submitting || pristine}
                      >
                        {/* Sign up */}
                        {t(
                          'landing.sign-up.sign-up-form.sign-up-button',
                        )}
                      </Button>
                      <span className="fw9 dt center pt4-ns pt2">
                        {t(
                          'landing.sign-up.sign-up-form.account-exist',
                        )}{' '}
                        <NavLink to="/signin">
                          {t(
                            'landing.login.sign-in-form.sign-in-text',
                          )}
                          {/* Sign in */}
                        </NavLink>
                      </span>
                      {/* <NavLink
                        className="fw9 dt center tigrow-lightBlue pt4-ns pt2"
                        to="/signin"
                      >
                        {t('landing.sign-up.sign-up-form.account-exist')}
                      </NavLink> */}
                    </div>
                  </form>
                </>
              )}
            />
          </div>
        </div>
      </div>
      <div
        className="fl w-100 w-50-ns dt vh-100 animated slideInLeft fast absolute-l displayNone"
        style={{
          zIndex: 9999,
          left: '50%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left-bottom',
          backgroundColor: '#060517',
        }}
      >
        <div className="v-mid dtc">
          <div className="w-50 center">
            <Link to="/">
              <img src={logo} alt="onethread" />
            </Link>
            <h3 className="tj mt4" style={{ color: '#E0E0E3' }}>
              {t(
                'landing.sign-up.about-one-thread-sign-up.content-sign-up',
              )}
            </h3>
            {/* <h3 className="tj mt4" style={{ color: '#E0E0E3' }}>
              Onethread is designed keeping in mind that Ease of
              Communication is the key to success for any enterprise.
              Onethread’s architecture has the key unique element of
              containerization with its feature called Project which
              ensures privacy within it, and fluidity to collaborate
              with external and internal stakeholders.
            </h3> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignUpPage = connect(null, { userSignupAction })(
  withRouter(SignUpPageComponent),
);

export default SignUpPage;
