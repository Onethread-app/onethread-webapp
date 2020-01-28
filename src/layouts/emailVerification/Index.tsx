import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { AxiosRequestConfig } from 'axios';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';

const EmailVerificationComponent = (props: RouteComponentProps) => {
  const [accountVerified, setAccountVerified] = useState(false);

  const getUserId = async (token: string) => {
    try {
      const response = await tigrowApi.get(`accounts/verify-account/${token}`, {
        'Content-Type': 'application/json'
      } as AxiosRequestConfig);
      if (response.status === 200) {
        setAccountVerified(true);
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
        console.log('network error');
      } else {
        // tslint:disable-next-line: no-console
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    const token = (props.match.params as any).token;
    getUserId(token);
  }, []);

  return (
    <div>
      {accountVerified ?
        <div className="mt5">
          <p className="tc f3 fw5">Account Verified Successfully</p>
          <p className="tc">
            <Link to={`/signin`}>
              <Button
                text="Sign in"
              />
            </Link>
          </p>
        </div>
        : <p className="tc f3 fw5 mt5 red">This link is expired.</p>}
    </div>
  );
};

export const EmailVerificationPage = withRouter(EmailVerificationComponent);