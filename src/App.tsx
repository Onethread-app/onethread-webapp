import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { SignUpPage } from "./pages/SignupPage";
import { LandingPage } from 'pages/LandingPage';
import { SignInPage } from 'pages/SignInPage';
import { Provider } from 'react-redux';
import { store } from 'Store';
import { isAuthenticate } from 'actions/AuthActions';

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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={SignInPage} />
          <Route exact path="/signuppage" component={SignUpPage} />
          {/* <Route exact path="/landing" component={LandingPage} /> */}
          <PrivateRoute path='/landing' exact={true} component={LandingPage} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
