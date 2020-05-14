import * as React from 'react';
import { useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  Link,
} from 'react-router-dom';
import ReactGA from 'react-ga';
import { SignUpPage } from './layouts/signup/Index';
import { SignInPage } from 'layouts/signin/Index';
import { isAuthenticate } from 'stores/UtilsActions';
import { RoomPage } from 'layouts/company/room/Index';
import { CompanyProfilePage } from 'layouts/company/profile/Index';
import { Layout } from 'components/Layout';
import { BoardPage } from 'layouts/company/board/Index';
import { ColleaguesPage } from 'layouts/company/colleagues/Index';
import { SettingsPage } from 'layouts/company/settings/Index';
import { ForgotPasswordPage } from 'layouts/forgotPassword/Index';
import { ResetPasswordPage } from 'layouts/resetPassword/Index';
import { EmailVerificationPage } from 'layouts/emailVerification/Index';
import { BoardDetailsView } from 'layouts/company/boardDetails/Index';
import { LandingPage } from 'layouts/user/profile/Index';
import { ProfileSettingsPage } from 'layouts/user/settings/Index';
import { FeedPage } from 'layouts/company/feed/Index';
import { HomePage } from 'layouts/landing/Index';
import { TaskPage } from 'layouts/company/task';
import { SignupConfirmationPage } from 'layouts/signupConfirmation/Index';
import { ProjectPage } from 'layouts/company/project/Index';
import { AssociatesPage } from 'layouts/company/associates/Index';
import { AssociatesDetailsView } from 'layouts/company/associateDetails/Index';
import { ProjectPrefaceView } from 'layouts/company/project/ProjectPrefaceView';
import { DashboardView } from 'layouts/dashBoard/Index';
import { ProjectSettingsPage } from 'layouts/company/project/settings/Index';
import { ProjectTeamPage } from 'layouts/company/project/team/Index';
import { isMobileOnly } from 'react-device-detect';
import { RoomPageMobile } from 'layouts/company/room/IndexMobile';
const PrivateRoute = (props: {
  component: any;
  path: string;
  exact: boolean;
}) => {
  useEffect(() => {
    ReactGA.initialize('UA-164759422-1', {
      debug: true,
      gaOptions: {
        cookieDomain: 'none',
      },
    });
    // To Report Page View
    ReactGA.pageview(
      window.location.pathname + window.location.search,
    );
  }, []);
  return (
    <Route
      path={props.path}
      exact={props.exact}
      render={() =>
        isAuthenticate() ? (
          <Layout Component={props.component} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

const Demo = () => <div></div>;

const NoMatch = () => (
  <article className="vh-100 dt w-100">
    <div className="dtc v-mid tc white ph3 ph4-l">
      <h1 className="tc black">THIS PAGE IS NOT AVAILABLE</h1>
    </div>
  </article>
);

const NotFound = () => (
  <article className="vh-100 dt w-100">
    <div className="dtc v-mid tc white ph3 ph4-l">
      <h1 className="f6 f2-m f-subheadline-l fw7 tc black">404</h1>
      <h1 className="tc black">
        WE ARE SORRY, BUT THE PAGE YOU REQUESTED WAS <br /> NOT FOUND
      </h1>
      <Link className="fw6 f4" to="/">
        Back to Profile
      </Link>
    </div>
  </article>
);

export const App = () => (
  <BrowserRouter>
    <Switch>
      {!isAuthenticate() && (
        <Route exact path="/" component={HomePage} />
      )}
      <Route
        exact
        path="/signin"
        render={() =>
          isAuthenticate() ? <Redirect to="/" /> : <SignInPage />
        }
      />
      <Route
        exact
        path="/signup"
        render={() =>
          isAuthenticate() ? <Redirect to="/" /> : <SignUpPage />
        }
      />
      <Route
        exact
        path="/forgot-password"
        render={() =>
          isAuthenticate() ? (
            <Redirect to="/" />
          ) : (
            <ForgotPasswordPage />
          )
        }
      />
      <Route
        path="/reset-password/:token"
        render={() =>
          isAuthenticate() ? (
            <Redirect to="/" />
          ) : (
            <ResetPasswordPage />
          )
        }
      />
      <Route
        path="/verify-account/:token"
        render={() =>
          isAuthenticate() ? (
            <Redirect to="/" />
          ) : (
            <EmailVerificationPage />
          )
        }
      />
      <Route
        path="/signup-confirmation"
        render={() =>
          localStorage.getItem('email') ? (
            <SignupConfirmationPage />
          ) : (
            <Redirect to="/signin" />
          )
        }
      />
      <Route
        path="/notFound"
        render={() =>
          isAuthenticate() ? <NotFound /> : <Redirect to="/" />
        }
      />
      <PrivateRoute exact path="/" component={Demo} />
      <PrivateRoute
        path="/:username"
        exact={true}
        component={LandingPage}
      />
      <PrivateRoute
        path="/:username/settings"
        exact={true}
        component={ProfileSettingsPage}
      />
      <PrivateRoute
        exact={true}
        path="/company/:cname"
        component={CompanyProfilePage}
      />
      <PrivateRoute
        path="/company/:cname/feed"
        exact={true}
        component={FeedPage}
      />
      <PrivateRoute
        path="/company/:cname/project/:projectId/room"
        exact={true}
        component={isMobileOnly ? RoomPageMobile : RoomPage}
      />
      <PrivateRoute
        path="/company/:cname/project/:projectId/board"
        exact={true}
        component={BoardPage}
      />
      <PrivateRoute
        path="/company/:cname/board/:boardId"
        exact={true}
        component={BoardDetailsView}
      />
      <PrivateRoute
        path="/company/:cname/board/:boardId/task/:taskId"
        exact={true}
        component={TaskPage}
      />
      <PrivateRoute
        path="/company/:cname/colleague"
        exact={true}
        component={ColleaguesPage}
      />
      <PrivateRoute
        path="/company/:cname/settings"
        exact={true}
        component={SettingsPage}
      />
      <PrivateRoute
        path="/company/:cname/dashboard"
        exact={true}
        component={DashboardView}
      />
      <PrivateRoute
        path="/company/:cname/project"
        exact={true}
        component={ProjectPage}
      />
      <PrivateRoute
        path="/company/:cname/project/:projectId"
        exact={true}
        component={ProjectPrefaceView}
      />
      <PrivateRoute
        path="/company/:cname/project/:projectId/team"
        exact={true}
        component={ProjectTeamPage}
      />
      <PrivateRoute
        path="/company/:cname/project/:projectId/settings"
        exact={true}
        component={ProjectSettingsPage}
      />
      <PrivateRoute
        path="/company/:cname/associates"
        exact={true}
        component={AssociatesPage}
      />
      <PrivateRoute
        path="/company/:cname/associate/:associateId"
        exact={true}
        component={AssociatesDetailsView}
      />
      <Route component={NoMatch} />
    </Switch>
  </BrowserRouter>
);
