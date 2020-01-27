import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Toaster } from '@blueprintjs/core';
import successfulEmailImage from './../../resources/images/successfulEmail.png';
import { connect } from 'react-redux';
import { resendMailForSignup } from 'stores/auth/Actions';
import { isEqual } from 'lodash';

const SignupConfirmationPageComponent = (props: {
  resendMailForSignup: () => any;
}) => {

  const onSubmit = async () => {
    const response = await props.resendMailForSignup();
    if (response.message === 200) {
      Toaster.create().show({message: 'Email has been send successfully'});
    }
    if (isEqual(response.message, 'Network Error')) {
      Toaster.create().show({message: 'Network Error'});
    }
  };

  return (
    <div className="fl w-100 pa2">
      <div className="fl w-100" style={{ height: '90vh' }}>
        <div className="flex flex-column h-100 items-center justify-center f3-l f4-m f5 fw5">
          <p>
            <img src={successfulEmailImage} />
          </p>
          <p className="tc">We have send you a mail to verify your account.</p>
          <p className="tc">Please check your mail to get the verification link.</p>
          <p className="mt4">Haven't got any mail?</p>
          <Button
            className="br3 f5 f4-m f3-l fw6 mt3 ph4 pv3"
            text="Resend mail"
            onClick={onSubmit}
          />
        </div>
      </div>
      <div className="fl pl4 pl2-l pt3 w-100" style={{ height: '10vh' }}>
        <Link to={`/signin`}>
          <Button
            text="Back to Sign In"
            minimal={true}
            icon="arrow-left"
          />
        </Link>
      </div>
    </div>
  );
};

export const SignupConfirmationPage = connect(null, { resendMailForSignup })(SignupConfirmationPageComponent);