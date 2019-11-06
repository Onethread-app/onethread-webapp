import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { SignUpPage } from "./pages/SignupPage";
import { LandingPage } from "pages/LandingPage";
import { SignInPage } from "pages/SignInPage";
import { isAuthenticate } from "stores/UtilsActions";
import { RoomPage } from "pages/company/RoomPage";
import { FeedPage } from "pages/company/FeedPage";
import { CompanyProfilePage } from 'pages/company/ProfilePage';
import { Layout } from 'components/common/Layout';
import { TaskPage } from 'pages/company/TaskPage';
import { TeamMembersPage } from 'pages/company/TeamMembersPage';
import { SettingsPage } from 'pages/company/SettingsPage';
import { ProfileSettingsPage } from 'pages/ProfileSettingsPage';
import { ForgotPasswordPage } from 'pages/ForgotPasswordPage';
import { ResetPasswordPage } from 'pages/ResetPasswordPage';
import { EmailVerificationPage } from 'pages/EmailVerificationPage';

const PrivateRoute = (props: {
	component: any;
	path: string;
	exact: boolean;
}) => {
	return (
		<Route
			path={props.path}
			exact={props.exact}
			render={r =>
				isAuthenticate() ?
					<Layout Component={props.component} />
					: <Redirect to="/signin" />
			}
		/>
	);
};

const Demo = () => (<div></div>)

const NoMatch = () => (<div>This page is not available</div>)

export const App = () => (
	<BrowserRouter>
		<Switch>
			<Route
				exact
				path="/signin"
				render={r =>
					isAuthenticate() ? <Redirect to="/" /> : <SignInPage />
				}
			/>
			<Route
				exact
				path="/signup"
				render={r =>
					isAuthenticate() ? <Redirect to="/" /> : <SignUpPage />
				}
			/>
			<Route
				exact
				path="/forgot-password"
				render={r =>
					isAuthenticate() ? <Redirect to="/" /> : <ForgotPasswordPage />
				}
			/>
			<Route
				path="/reset-password/:token"
				render={r =>
					isAuthenticate() ? <Redirect to="/" /> : <ResetPasswordPage />
				}
			/>
			<Route
				path="/verify-account/:token"
				render={r =>
					isAuthenticate() ? <Redirect to="/" /> : <EmailVerificationPage />
				}
			/>
			<PrivateRoute
				exact
				path="/"
				component={Demo}
			/>
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
				path="/company/:cname/room"
				exact={true}
				component={RoomPage}
			/>
			<PrivateRoute
				path="/company/:cname/task"
				exact={true}
				component={TaskPage}
			/>
			<PrivateRoute
				path="/company/:cname/team"
				exact={true}
				component={TeamMembersPage}
			/>
			<PrivateRoute
				path="/company/:cname/settings"
				exact={true}
				component={SettingsPage}
			/>
			<Route component={NoMatch} />
			
		</Switch>

	</BrowserRouter>
);
