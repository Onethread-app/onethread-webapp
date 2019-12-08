import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { AxiosRequestConfig } from 'axios';
import { withRouter, RouteComponentProps } from 'react-router';

const EmailVerificationComponent = (props: RouteComponentProps) => {
  const [accountVerified, setAccountVerified] = useState(false);

  const getUserId = async (token: string) => {
    try {
      const response = await tigrowApi.get(`accounts/verify-account/${token}`, {
        "Content-Type": "application/json"
      } as AxiosRequestConfig);
      setAccountVerified(response.data.accountVerified)
    }
    catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        console.log('network error')
      }
      else {
        console.log(error.response);
      }
    }
  }

  useEffect(() => {
    const token = (props.match.params as any).token;
    getUserId(token);
  }, [])

  return (
    accountVerified ?
      <p>Account Verified Successfully</p> : <p>Email has already been registered</p>
  )
}

export const EmailVerificationPage = withRouter(EmailVerificationComponent)