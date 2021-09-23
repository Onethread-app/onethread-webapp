import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isEqual } from 'lodash';

import { Toaster } from '@blueprintjs/core/lib/esm/components/toast/toaster';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { resendMailForSignup } from 'stores/auth/Actions';

import successfulEmailImage from '../../resources/images/successfulEmail.png';

const SignupConfirmationPageComponent = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    const response = await resendMailForSignup();
    if (response.message === 200) {
      Toaster.create().show({
        message: 'Email has been send successfully',
      });
    }
    if (isEqual(response.message, 'Network Error')) {
      Toaster.create().show({ message: 'Network Error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    const em = localStorage.getItem('email');
    if (em) setEmail(em.replace(/['"]+/g, ''));
  }, []);

  return (
    <div className='fl w-100 pa2'>
      <div className='fl w-100' style={{ height: '90vh' }}>
        <div className='flex flex-column h-100 items-center justify-center f3-l f4-m f5 fw5'>
          <p>
            <img src={successfulEmailImage} alt='' />
          </p>
          <p className='tc'>
            We have sent an email with a confirmation link to
            {' '}
            <strong>{email}</strong>
            <br />
            Please allow 5-10 minutes for this message to arrive.
            <br />
            The link will be valid for next 45 minutes.
            <h4>Haven&#39;t got any mail?</h4>
            <br />
            Please, check your spam folder.
            <h4>Still, Didn&#39;t get any mail?</h4>
            Submit your issue at contact@onethread.app
          </p>
          <Button
            className='br3 f5 f4-m f3-l fw6 mt3 ph4 pv3'
            text='Resend mail'
            onClick={onSubmit}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
      <div
        className='fl pl4 pl2-l pt3 w-100'
        style={{ height: '10vh' }}
      >
        <Link to='/signin'>
          <Button
            text='Back to Sign In'
            minimal
            icon='arrow-left'
          />
        </Link>
      </div>
    </div>
  );
};

export const SignupConfirmationPage = SignupConfirmationPageComponent;

export default SignupConfirmationPage;
