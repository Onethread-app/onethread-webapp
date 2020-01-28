import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { AxiosRequestConfig } from 'axios';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';

const EmailVerificationComponent = (props: RouteComponentProps) => {
  const [accountVerified, setAccountVerified] = useState({
    status: undefined,
    isAccountVerified: undefined,
    message: ''
  });

  useEffect(() => {
    const token = (props.match.params as any).token;

    async function getUserId(userToken: string) {
      let responsedata = accountVerified;
      try {
        const response: any = await tigrowApi.get(`accounts/verify-account/${userToken}`, {
          'Content-Type': 'application/json'
        } as AxiosRequestConfig);
        responsedata = {
          status: response.status,
          isAccountVerified: response.data.isAccountVerified,
          message: response.data.message
        };
      } catch (error) {
        if (isEqual(error.message, 'Network Error')) {
          setAccountVerified({
            ...accountVerified,
            message: 'Network Error'
          });
        } else {
          responsedata = {
            status: error.response.status,
            isAccountVerified: error.response.data.isAccountVerified,
            message: error.response.data.message
          };
        }
      }
      setAccountVerified(responsedata);
    }

    getUserId(token);
  }, []);

  return (
    <div className="mt5">
      {isEqual(accountVerified.status, 200) === true && accountVerified.isAccountVerified === true ?
        <>
          <p className="tc f3 fw5">{accountVerified.message}</p>
          <p className="tc">
            <Link to={`/signin`}>
              <Button
                text="Sign in"
              />
            </Link>
          </p>
        </>
        : isEqual(accountVerified.status, undefined) === false && accountVerified.isAccountVerified === false ?
          <p className="tc f3 fw5 red">{accountVerified.message}</p>
          : <p className="tc f3 fw5 blue">Your mail is verifing now....</p>}
    </div>
  );
};

export const EmailVerificationPage = withRouter(EmailVerificationComponent);