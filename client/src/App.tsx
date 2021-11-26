import { useEffect, Suspense, lazy } from 'react';
import { withRouter } from 'react-router';
import {
  Link,
  Redirect,
  Route,
  Switch,
  // useLocation,
} from 'react-router-dom';
import { connect } from 'react-redux';
// import { isMobileOnly } from 'react-device-detect';
import ReactGA from 'react-ga';

import ErrorBoundary from 'components/error-boundary/ErrorBoundary';
import SuspenseLoader from 'components/loader/SuspenseLoader';

import { isAuthenticate } from 'stores/UtilsActions';

import GlobalStyle from './App.styles';
import { toast } from 'react-toastify';

const AutoLoginPage = lazy(() => import('components/AutoLogin'));
const NewLanding = lazy(() => import('layouts/landingx/Index'));
const SignInPage = lazy(() => import('layouts/signin/Index'));
const SignUpPage = lazy(() => import('layouts/signup/Index'));
const PricingPage = lazy(() => import('layouts/landingx/Pricing'));
const EmailVerificationPage = lazy(
  () => import('layouts/emailVerification/Index'),
);
const ForgotPasswordPage = lazy(
  () => import('layouts/forgotPassword/Index'),
);
const ResetPasswordPage = lazy(
  () => import('layouts/resetPassword/Index'),
);
const SignupConfirmationPage = lazy(
  () => import('layouts/signupConfirmation/Index'),
);
const Layout = lazy(() => import('components/Layout'));
const HomePage = lazy(() => import('layouts/home/Index'));
const CompanyDashboard = lazy(
  () => import('layouts/newCompany/Index'),
);
const CompanyProfilePage = lazy(
  () => import('layouts/company/profile/Index'),
);
const ProjectDashboard = lazy(
  () => import('layouts/newProject/Index'),
);
const SettingsPage = lazy(
  () => import('layouts/company/settings/Index'),
);
const TaskPage = lazy(() => import('layouts/company/task'));
const UserProfilePage = lazy(
  () => import('layouts/user/profile/Index'),
);
const ProfileSettingsPage = lazy(
  () => import('layouts/user/settings/Index'),
);
const NotificationPage = lazy(
  () => import('layouts/notification/Index'),
);
const VideoConferences = lazy(
  () => import('layouts/videoConferences/pages/index/index'),
);
const Meeting = lazy(
  () => import('layouts/videoConferences/pages/meeting'),
);
const Success = lazy(() => import('components/Success'));
const Feedback = lazy(() => import('layouts/feedback/Feedback'));
const UserInfo = lazy(() => import('layouts/userInfo/Index'));
const CreateCompany = lazy(
  () => import('layouts/createCompany/Index'),
);
const SearchCompany = lazy(
  () => import('layouts/searchCompany/Index'),
);
const AddMembers = lazy(() => import('layouts/addMembers/Index'));
const JoinCompanyPage = lazy(
  () => import('layouts/joinCompany/Index'),
);
const AllTasksPage = lazy(() => import('layouts/allTasks/Index'));
const AllProjectsPage = lazy(
  () => import('layouts/allProjects/Index'),
);
const PrivateRoute = (props: {
  component: any;
  path: string | string[];
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
  toast.configure();
  // const location: any = useLocation();
  // const background = location.state && location.state.background;
  return (
    <ErrorBoundary>
      <Suspense fallback={<SuspenseLoader />}>
        <GlobalStyle />
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
          <Route path="/user-info" component={UserInfo} />
          <Route path="/create-company" component={CreateCompany} />
          <Route path="/search-company" component={SearchCompany} />
          <Route path="/add-members" component={AddMembers} />
          <Route
            path="/join/:companyId"
            component={JoinCompanyPage}
          />

          <PrivateRoute exact path="/" component={Demo} />
          <PrivateRoute
            path="/tasks"
            exact={false}
            component={AllTasksPage}
          />
          <PrivateRoute
            path="/projects"
            exact={false}
            component={AllProjectsPage}
          />
          <PrivateRoute
            path="/feedback"
            exact={true}
            component={Feedback}
          />
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
            component={CompanyDashboard}
          />
          <PrivateRoute
            exact={true}
            path="/company/:cname/profile"
            component={CompanyProfilePage}
          />
          <PrivateRoute
            path="/company/:cname/project/:projectId/task/:taskId"
            exact={true}
            component={TaskPage}
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
            path="/company/:cname/project/:projectId"
            exact={true}
            component={ProjectDashboard}
          />
          {/* <PrivateRoute
            path="/company/:cname/associate/:associateId"
            exact={true}
            component={AssociatesDetailsView}
          /> */}
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
        {/* {background && (
          <Route path="/task/:taskId" children={<TaskModal />} />
        )} */}
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
