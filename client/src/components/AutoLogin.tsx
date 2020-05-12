import React from 'react';
import { withRouter, RouteComponentProps, Redirect } from 'react-router';

const AutoLogin =  (props: RouteComponentProps) => {
  const query = new URLSearchParams(props.location.search);
  const token = JSON.stringify(query.get('token'));
  const refreshToken = JSON.stringify(query.get('refreshToken'));
  const view = query.get('view');
  const redirectURL = query.get('redirectURL') + (view === "mobile" ? "&view="+view : "");
  localStorage.setItem('tigrow_acc_id', token);
  localStorage.setItem('tigrow_real_id', refreshToken);

  return (
    <>
      { redirectURL ? 
        <Redirect to={redirectURL} />
        : 
        <Redirect to="/" />
      }
    </>
  );
};

export const AutoLoginPage = withRouter(AutoLogin);
