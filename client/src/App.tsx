import React, { useEffect, Suspense, lazy } from 'react';
import { withRouter } from 'react-router';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import ReactGA from 'react-ga';

import ErrorBoundary from 'components/error-boundary/ErrorBoundary';
import SuspenseLoader from 'components/loader/SuspenseLoader';

import { isAuthenticate } from 'stores/UtilsActions';

const AutoLoginPage = lazy(() => import('components/AutoLogin'));
const NewLanding = lazy(() => import('layouts/landingx/Index'));
const SignInPage = lazy(() => import('layouts/signin/Index'));
const SignUpPage = lazy(() => import('layouts/signup/Index'));
const PricingPage = lazy(() => import('layouts/landingx/Pricing'));
const EmailVerificationPage = lazy(() =>
  import('layouts/emailVerification/Index'),
);
const ForgotPasswordPage = lazy(() =>
  import('layouts/forgotPassword/Index'),
);
const ResetPasswordPage = lazy(() =>
  import('layouts/resetPassword/Index'),
);
const SignupConfirmationPage = lazy(() =>
  import('layouts/signupConfirmation/Index'),
);
const Layout = lazy(() => import('components/Layout'));
const FeedPage = lazy(() => import('layouts/company/feed/Index'));
const HomePage = lazy(() => import('layouts/home/Index'));
const DashboardView = lazy(() => import('layouts/dashBoard/Index'));
const ColleaguesPage = lazy(() =>
  import('layouts/company/colleagues/Index'),
);
const BoardPage = lazy(() => import('layouts/company/board/Index'));
const AssociatesDetailsView = lazy(() =>
  import('layouts/company/associateDetails/Index'),
);
const OverviewPage = lazy(() =>
  import('layouts/company/overview/Index'),
);
const AssociatesPage = lazy(() =>
  import('layouts/company/associates/Index'),
);
const CompanyProfilePage = lazy(() =>
  import('layouts/company/profile/Index'),
);
const ProjectPage = lazy(() =>
  import('layouts/company/project/Index'),
);
const ProjectPrefaceView = lazy(() =>
  import('layouts/company/project/ProjectPrefaceView'),
);
const ProjectSettingsPage = lazy(() =>
  import('layouts/company/project/settings/Index'),
);
const ProjectTeamPage = lazy(() =>
  import('layouts/company/project/team/Index'),
);
const RoomPage = lazy(() => import('layouts/company/room/Index'));
const RoomPageMobile = lazy(() =>
  import('layouts/company/room/IndexMobile'),
);
const SettingsPage = lazy(() =>
  import('layouts/company/settings/Index'),
);
const BoardDetails = lazy(() =>
  import('components/board/BoardDetails'),
);
const TaskPage = lazy(() => import('layouts/company/task'));
const UserProfilePage = lazy(() =>
  import('layouts/user/profile/Index'),
);
const ProfileSettingsPage = lazy(() =>
  import('layouts/user/settings/Index'),
);
const NotificationPage = lazy(() =>
  import('layouts/notification/Index'),
);
const VideoConferences = lazy(() =>
  import('layouts/videoConferences/pages/index/index'),
);
const Meeting = lazy(() =>
  import('layouts/videoConferences/pages/meeting'),
);
const Success = lazy(() => import('components/Success'));
const Feedback = lazy(() => import('layouts/feedback/Feedback'));

const PrivateRoute = (props: {
  component: any;
  path: string;
  exact: boolean;
}) => {
  useEffect(() => {
    ReactGA.initialize('UA-194627645-1', {
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

const App = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SuspenseLoader />}>
        <Switch>
          {!isAuthenticate() && (
            <Route exact path="/" component={NewLanding} />
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
          <Route path="/autologin" render={() => <AutoLoginPage />} />
          <Route
            exact
            path="/pricing"
            render={() =>
              isAuthenticate() ? <Redirect to="/" /> : <PricingPage />
            }
          />
          {/* <Route
          exact
          path="/work-from-home-solution"
          render={() =>
            isAuthenticate() ? (
              <Redirect to="/" />
            ) : (
              <WorkFromHomePage />
            )
          }
        />
        <Route
          exact
          path="/vendor-management-tool"
          render={() =>
            isAuthenticate() ? <Redirect to="/" /> : <VendorManagementPage />
          }
        />
        <Route
          exact
          path="/project-management-tool"
          render={() =>
            isAuthenticate() ? <Redirect to="/" /> : <ProjectManagementTool />
          }
        />
        <Route
          exact
          path="/about"
          render={() =>
            isAuthenticate() ? <Redirect to="/" /> : <AboutPage />
          }
        />
        <Route
          exact
          path="/contact"
          render={() =>
            isAuthenticate() ? <Redirect to="/" /> : <ContactUsPage />
          }
        /> */}
          <PrivateRoute exact path="/" component={Demo} />
          <PrivateRoute
            path="/:username"
            exact={true}
            component={UserProfilePage}
          />
          <PrivateRoute
            path="/:username/home"
            exact={false}
            component={HomePage}
          />
          <PrivateRoute
            path="/:username/settings"
            exact={false}
            component={ProfileSettingsPage}
          />
          <PrivateRoute
            path="/:username/notifications"
            exact={true}
            component={NotificationPage}
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
            path="/company/:cname/feedback"
            exact={true}
            component={Feedback}
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
            path="/company/:cname/project/:projectId/overview"
            exact={true}
            component={OverviewPage}
          />
          <PrivateRoute
            path="/company/:cname/project/:projectId/board/:boardId"
            exact={true}
            component={BoardDetails}
          />
          <PrivateRoute
            path="/company/:cname/project/:projectId/board/:boardId/task/:taskId"
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
            path="/company/:cname/settings/payment/success"
            exact={true}
            component={Success}
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
          <PrivateRoute
            path="/video/conferences"
            exact={true}
            component={VideoConferences}
          />

          <PrivateRoute
            path="/vc/join"
            exact={true}
            component={Meeting}
          />
          <Route component={NoMatch} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
};
const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    currentCompany: state.companyReducer.currentCompany,
  };
};

export default connect(mapStateToProps, {})(withRouter(App));
