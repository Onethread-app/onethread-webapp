import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { required, checkError, composeValidators, isEmail, phoneNoValidation, passwordValidation } from 'components/final-form/utils';
import { Link, NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { Tooltip, Button, Position, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { userSignupAction, UserModel } from 'stores/auth/Actions';
import { isEmpty } from 'lodash';

import logo from './../../resources/images/logo.png';
import nameTagIcon from './../../resources/images/nameTag.png';
import phoneIcon from './../../resources/images/phone.png';
import emailIcon from './../../resources/images/email.png';
import lockIcon from './../../resources/images/lock.png';
import eyeIcon from './../../resources/images/eye.png';
import questionIcon from './../../resources/images/question.png';
import greyLockIcon from './../../resources/images/lock-grey.png';
import backgroundImage from './../../resources/images/Bg-png.png';
import { SubmitError } from 'components/final-form/SubmitError';
import { DateInput } from '@blueprintjs/datetime';
import moment from 'moment';

interface SignUpPageInternalProps {
  userSignupAction: (user: UserModel) => any;
}

export const SignUpPageComponent = (props: SignUpPageInternalProps & RouteComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (values: any) => {
    const response = await props.userSignupAction(values);
    if (response.message === 200) {
      props.history.push(`/${response.payload.data.user.name}`);
      return true;
    }
    return { [response.fieldName]: response.message };
  };

  const [email, setEmail] = useState('');

  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    setEmail(params.get('email') ? params.get('email')! : '');
  }, [props.location.search]);

  return (
    <div className="cf ph2-ns">
      <div className="fl w-100 w-50-ns dt vh-100" style={{ backgroundColor: 'white' }}>
        <div className="v-mid dtc">
          <div className="w-two-thirds-l w-90-m center">
            <Form
              onSubmit={onSubmit}
              initialValues={{ email: email ? email : '' }}
              validate={(values: any) => {
                const errors = {} as any;
                if (values.password !== values.confirmPassword) {
                  errors.confirmPassword = 'Password does not match';
                }
                return errors;
              }}
              render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors,
                ...rest }) => (
                  <>
                    <h1 className="pl3">Sign Up</h1>
                    <form
                      className="dt fl cf"
                      onSubmit={handleSubmit}>
                      <div className="mw9 center ph3-ns v-mid dtc">
                        <SubmitError errorMessage={submitError} />
                        <div className="flex pt3 justify-content">
                          <div>
                            <Field<string>
                              name="firstName"
                              validate={composeValidators(required)}
                              render={({ input, meta }) =>
                                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                                  <InputGroupFieldWithError
                                    id="firstName"
                                    className={`bw1 pb2 br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                                    value={input.value}
                                    onChange={input.onChange}
                                    leftIcon={
                                      <span className="bp3-icon">
                                        <img
                                          src={nameTagIcon}
                                          width="20px"
                                          height="20px"
                                          color="#0fa3a3"
                                        />
                                      </span>
                                    }
                                    style={{
                                      boxShadow: 'none',
                                      fontSize: '18px',
                                      paddingLeft: '40px'
                                    }}
                                    placeHolder="First Name"
                                    error={checkError(meta) && (meta.error || meta.submitError)}
                                  />
                                </div>
                              }
                            />
                          </div>
                          <Field<string>
                            name="lastName"
                            validate={composeValidators(required)}
                            render={({ input, meta }) =>
                              <div className="ml3">
                                <div>
                                  <InputGroupFieldWithError
                                    id="lastName"
                                    className={`bw1 pb2 br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                                    value={input.value}
                                    onChange={input.onChange}
                                    style={{
                                      boxShadow: 'none',
                                      fontSize: '18px'
                                    }}
                                    placeHolder="Last Name"
                                    error={checkError(meta) && (meta.error || meta.submitError)}
                                  />
                                </div>
                              </div>
                            }
                          />
                        </div>

                        <div className={`flex justify-content`}>
                          <div style={{ width: '114px' }}>
                            <Field<string>
                              name="countryCode"
                              render={({ input, meta }) =>
                                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                                  <InputGroupFieldWithError
                                    id="countryCode"
                                    className={`bw1 pb2 br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                                    value="+88"
                                    readOnly={true}
                                    onChange={input.onChange}
                                    leftIcon={
                                      <span className="bp3-icon">
                                        <img
                                          src={phoneIcon}
                                          width="20px"
                                          height="20px"
                                          color="#0fa3a3"
                                        />
                                      </span>
                                    }
                                    style={{
                                      boxShadow: 'none',
                                      fontSize: '18px',
                                      paddingLeft: '40px'
                                    }}
                                    error={checkError(meta) && (meta.error || meta.submitError)}
                                  />
                                </div>
                              }
                            />
                          </div>

                          <div className="ml3 ml1-m flex-auto">
                            <div className="w-100">
                              <Field<string>
                                name="contactNo"
                                validate={composeValidators(required, phoneNoValidation)}
                                render={({ input, meta }) =>
                                  <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                                    <InputGroupFieldWithError
                                      id="contactNo"
                                      className={`bw1 pb2 br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                                      value={input.value}
                                      onChange={input.onChange}
                                      style={{
                                        boxShadow: 'none',
                                        fontSize: '18px'
                                      }}
                                      placeHolder="Contact Number"
                                      keypress={e => {
                                        if ((e.which < 48 || e.which > 57)) {
                                          e.preventDefault();
                                        }
                                      }}
                                      error={checkError(meta) && (meta.error || meta.submitError)}
                                    />
                                  </div>
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex ">
                          <div >
                            <Icon
                              icon="calendar"
                              className="bw1 bb b--lightBlue pl2"
                              style={{ color: '#0fa3a3', paddingBottom: '.97rem' }}
                            />
                          </div>
                          <div className="flex-auto">
                            <Field<string>
                              name="birthDate"
                              validate={required}
                              render={({ input, meta }) =>
                                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                                  <DateInput
                                    className={` bw1 pb2 br0 bb birthdatePicker ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                                    formatDate={(date: Date) => date.toLocaleDateString()}
                                    parseDate={(str: string) => new Date(str)}
                                    onChange={input.onChange}
                                    canClearSelection={false}
                                    value={input.value ? input.value : null}
                                    popoverProps={{
                                      targetClassName: 'w-100 '
                                    }}
                                    minDate={new Date('1800-01-01')}
                                    placeholder="Birth Date"
                                    maxDate={moment(new Date()).subtract(13, 'years').toDate()}

                                  />
                                  {checkError(meta) &&
                                    <small className="mv3" style={{ color: 'red' }}>
                                      {meta.error || meta.submitError}
                                    </small>}
                                </div>
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <div>
                            <Field<string>
                              name="email"
                              validate={composeValidators(required, isEmail)}
                              render={({ input, meta }) =>
                                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                                  <InputGroupFieldWithError
                                    id="email"
                                    className={`bw1 pb2 br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                                    value={input.value}
                                    onChange={input.onChange}
                                    leftIcon={
                                      <span className="bp3-icon">
                                        <img
                                          src={emailIcon}
                                          width="20px"
                                          height="20px"
                                          color="#0fa3a3"
                                        />
                                      </span>
                                    }
                                    rightElement={
                                      <span className="bp3-icon" style={{ paddingTop: '10px', paddingRight: '5px' }}>
                                        <img
                                          src={greyLockIcon}
                                          width="15px"
                                          height="15px"
                                          color="#0fa3a3"
                                        />
                                      </span>
                                    }
                                    style={{
                                      boxShadow: 'none',
                                      fontSize: '18px',
                                      paddingLeft: '40px'
                                    }}
                                    placeHolder="Email Address"
                                    error={checkError(meta) && (meta.error || meta.submitError)}
                                    disabled={isEmpty(email) === false}
                                  />
                                </div>
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <div>
                            <Field<string>
                              name="password"
                              validate={composeValidators(required, passwordValidation)}
                              render={({ input, meta }) =>
                                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                                  <InputGroupFieldWithError
                                    id="password"
                                    className={`bw1 pb2 br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                                    value={input.value}
                                    onChange={input.onChange}
                                    type={`${showPassword ? 'text' : 'password'}`}
                                    leftIcon={
                                      <span className="bp3-icon">
                                        <img
                                          src={lockIcon}
                                          width="20px"
                                          height="20px"
                                          color="#0fa3a3"
                                        />
                                      </span>
                                    }
                                    rightElement={
                                      <span className="bp3-icon" style={{ paddingTop: '5px', paddingRight: '5px' }}>
                                        <span style={{ paddingRight: '10px' }}>
                                          <img
                                            onMouseDown={() => setShowPassword(true)}
                                            onMouseUp={() => setShowPassword(false)}
                                            src={eyeIcon}
                                            width="15px"
                                            height="15px"
                                            color="#0fa3a3"
                                          />
                                        </span>
                                        <Tooltip content={
                                          <p style={{ width: '400px' }}>
                                            Password should contain at least 1 capital letter, 1 small letter,
                                            1 special character and 1 numeric value
                                        </p>}
                                          position={Position.TOP_RIGHT}>
                                          <img
                                            src={questionIcon}
                                            width="20px"
                                            height="20px"
                                            color="#0fa3a3"
                                          />
                                        </Tooltip>
                                      </span>
                                    }
                                    style={{
                                      boxShadow: 'none',
                                      fontSize: '18px',
                                      paddingLeft: '40px'
                                    }}
                                    placeHolder="Password"
                                    error={checkError(meta) && (meta.error || meta.submitError)}
                                  />
                                </div>
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <div>
                            <Field<string>
                              name="confirmPassword"
                              validate={composeValidators(required)}
                              render={({ input, meta }) =>
                                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                                  <InputGroupFieldWithError
                                    id="confirmPassword"
                                    className={`bw1 pb2 br0 bb ${checkError(meta) ? 'b--red' : 'b--lightBlue'}`}
                                    value={input.value}
                                    onChange={input.onChange}
                                    type={`${showConfirmPassword ? 'text' : 'password'}`}
                                    leftIcon={
                                      <span className="bp3-icon">
                                        <img
                                          src={lockIcon}
                                          width="20px"
                                          height="20px"
                                          color="#0fa3a3"
                                        />
                                      </span>
                                    }
                                    rightElement={
                                      <span className="bp3-icon" style={{ paddingTop: '10px', paddingRight: '5px' }}>
                                        <img
                                          onMouseDown={() => setShowConfirmPassword(true)}
                                          onMouseUp={() => setShowConfirmPassword(false)}
                                          src={eyeIcon}
                                          width="15px"
                                          height="15px"
                                          color="#0fa3a3"
                                        />
                                      </span>
                                    }
                                    style={{
                                      boxShadow: 'none',
                                      fontSize: '18px',
                                      paddingLeft: '40px'
                                    }}
                                    placeHolder="Confirm Password"
                                    error={checkError(meta) && (meta.error || meta.submitError)}
                                  />
                                </div>
                              }
                            />
                          </div>
                        </div>
                        <Button
                          className="grow h2 pointer white bp3-minimal w4"
                          style={{
                            background: '#0FA3A3',
                            outline: 'none',
                            color: 'white',
                            width: '100%',
                            height: '45px',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}
                          loading={submitting}
                          type="submit"
                          disabled={submitting || pristine}
                        >
                          Sign up
                      </Button>
                        <NavLink className="fw9 dt center tigrow-lightBlue pt4" to="/signin">
                          Already have an account?
                      </NavLink>
                      </div>
                    </form>
                  </>
                )
              }
            />
          </div>

        </div>
      </div>
      <div className="fl w-100 w-50-ns dt vh-100 animated slideInLeft fast absolute-l"
        style={{
          zIndex: 9999, left: '50%', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat', backgroundPosition: 'left-bottom', backgroundColor: '#060517'
        }}
      >
        <div className="v-mid dtc">
          <div className="w-50 center">
            <Link to="/home">
              <img width="150px"
                height="70px"
                src={logo} />
            </Link>
            <h3 className="tj mt4" style={{ color: '#E0E0E3' }}>
              TiGrow is a professional network crafted for
                    Business Professionals, where they can
                    trade between each other, find nearest
                    suppliers, create workplaces in which they
                    can maintain not only intra company
                    communications but also external
                    communications with organizations where
                    they can create smart contracts between
                    them.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignUpPage = connect(null, { userSignupAction })(withRouter(SignUpPageComponent));