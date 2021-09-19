import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { isEqual } from 'lodash';

import { Toaster } from '@blueprintjs/core/lib/esm/components/toast/toaster';
// import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { resendMailForSignup } from 'stores/auth/Actions';
import {
  Logo,
  SmallContainer,
  TextLink,
  StyledButton,
} from './Index.styles';

// import successfulEmailImage from './../../resources/images/successfulEmail.png';

const SignupConfirmationPageComponent = () => {
  // const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = async () => {
    // setLoading(true);
    const response = await resendMailForSignup();
    if (response.message === 200) {
      Toaster.create().show({
        message: 'Email has been send successfully',
        intent: 'success',
      });
    }
    if (isEqual(response.message, 'Network Error')) {
      Toaster.create().show({ message: 'Network Error' });
    }
    // setLoading(false);
  };

  useEffect(() => {
    const em = localStorage.getItem('email');
    if (em) setEmail(em.replace(/['"]+/g, ''));
  }, []);

  return (
    <div className="fl w-100 pa2">
      <div
        className="fl w-100 flex flex-column"
        style={{ height: '90vh' }}
      >
        <div className="flex flex-column h-100 items-center justify-center f3-l f4-m f5 fw5">
          {/* <p>
            <img src={successfulEmailImage} />
          </p> */}
          <div className="tc">
            <Logo to="/">
              One<span>Thread</span>
            </Logo>
            <h1>Please verify your email address</h1>
            We will send an email with a confirmation link to{' '}
            <strong>{email}</strong> <br />
            within the next 5 minutes.
            <br />
            The link will be valid for next 45 minutes.
            <h4>You didn’t received the confirmation email?</h4>
            <br />
          </div>
          <StyledButton onClick={onSubmit}>Resend link</StyledButton>
          <SmallContainer>
            <p>
              It’s the wrong email address?{' '}
              <TextLink to="/signup">Change my email</TextLink>
            </p>
            <p>
              Already have an account?{' '}
              <TextLink to="/signin">Log in</TextLink>
            </p>
          </SmallContainer>
        </div>
      </div>
      {/* <div
        className="fl pl4 pl2-l pt3 w-100"
        style={{ height: '10vh' }}
      >
        <Link to={`/signin`}>
          <Button
            text="Back to Sign In"
            minimal={true}
            icon="arrow-left"
          />
        </Link>
      </div> */}
    </div>
  );
};

export const SignupConfirmationPage = SignupConfirmationPageComponent;

export default SignupConfirmationPage;
