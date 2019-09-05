import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SignUpPage } from "./pages/SignupPage";
import { LoginPage } from 'pages/LoginPage';
import { LandingPage } from 'pages/LandingPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/signuppage" component={SignUpPage} />
        <Route exact path="/landing" component={LandingPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
