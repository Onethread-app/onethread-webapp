import { AutoLoginPage } from 'components/AutoLogin';
import { Layout } from 'components/Layout';
import { AssociatesDetailsView } from 'layouts/company/associateDetails/Index';
import { AssociatesPage } from 'layouts/company/associates/Index';
import { BoardPage } from 'layouts/company/board/Index';
import { BoardDetailsView } from 'layouts/company/boardDetails/Index';
import { ColleaguesPage } from 'layouts/company/colleagues/Index';
import { FeedPage } from 'layouts/company/feed/Index';
import { OverviewPage } from 'layouts/company/overview/Index';
import { CompanyProfilePage } from 'layouts/company/profile/Index';
import { ProjectPage } from 'layouts/company/project/Index';
import { ProjectPrefaceView } from 'layouts/company/project/ProjectPrefaceView';
import { ProjectSettingsPage } from 'layouts/company/project/settings/Index';
import { ProjectTeamPage } from 'layouts/company/project/team/Index';
import { RoomPage } from 'layouts/company/room/Index';
import { RoomPageMobile } from 'layouts/company/room/IndexMobile';
import { SettingsPage } from 'layouts/company/settings/Index';
import { TaskPage } from 'layouts/company/task';
import { DashboardView } from 'layouts/dashBoard/Index';
import { EmailVerificationPage } from 'layouts/emailVerification/Index';
import { ForgotPasswordPage } from 'layouts/forgotPassword/Index';
import { HomePageNew } from 'layouts/home/Index';
import NewLanding from 'layouts/landingx/Index';
import { ResetPasswordPage } from 'layouts/resetPassword/Index';
import { SignInPage } from 'layouts/signin/Index';
import { SignupConfirmationPage } from 'layouts/signupConfirmation/Index';
import { UserProfilePage } from 'layouts/user/profile/Index';
import { ProfileSettingsPage } from 'layouts/user/settings/Index';
import NotificationPage from 'layouts/notification/Index';
import VideoConferences from 'layouts/videoConferences/pages/index/index';
import Meeting from 'layouts/videoConferences/pages/meeting';
import * as React from 'react';
import { useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { isAuthenticate } from 'stores/UtilsActions';
import Success from './components/Success';
import { SignUpPage } from './layouts/signup/Index';
import PricingPage from 'layouts/landingx/Pricing';
import Feedback from 'layouts/feedback/Feedback';

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
        component={HomePageNew}
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
        component={BoardDetailsView}
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
  );
};
const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    currentCompany: state.companyReducer.currentCompany,
  };
};

export default connect(mapStateToProps, {})(withRouter(App));
