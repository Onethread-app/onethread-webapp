import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { SignUpPage } from "./pages/SignupPage";
import { LandingPage } from 'pages/LandingPage';
import { SignInPage } from 'pages/SignInPage';
import { connect } from 'react-redux';
import { fetchUserAction } from 'actions/AuthActions';
import { useEffect } from 'react';
import { isAuthenticate } from 'actions/UtilsActions';

const PrivateRoute = (props: {
  component: any;
  path: string;
  exact: boolean;
}) => {

  const Component: any = props.component;
  return (
    <Route
      path={props.path}
      exact={props.exact}
      render={r =>
        isAuthenticate() ? <Component /> : <Redirect to="/" />
      }
    />);
};

interface AppProps {
  fetchUserAction: () => void;
}

const AppComponent = (props: AppProps) => {

  useEffect(() => {
    props.fetchUserAction();
  })

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={SignInPage} />
        <Route exact path="/signuppage" component={SignUpPage} />
        {/* <Route exact path="/landing" component={LandingPage} /> */}
        <PrivateRoute path='/landing' exact={true} component={LandingPage} />
      </Switch>
    </BrowserRouter>
  );
};

export const App = connect(null, { fetchUserAction })(AppComponent)
