import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { SignUpPage } from './layouts/signup/Index';
import { SignInPage } from 'layouts/signin/Index';
import { isAuthenticate } from 'stores/UtilsActions';
import { RoomPage } from 'layouts/company/room/Index';
import { CompanyProfilePage } from 'layouts/company/profile/Index';
import { Layout } from 'components/Layout';
import { TaskPage } from 'layouts/company/board/Index';
import { TeamMembersPage } from 'layouts/company/team/Index';
import { SettingsPage } from 'layouts/company/settings/Index';
import { ForgotPasswordPage } from 'layouts/forgotPassword/Index';
import { ResetPasswordPage } from 'layouts/resetPassword/ResetPasswordPage';
import { EmailVerificationPage } from 'layouts/emailVerification/Index';
import { BoardDetailsView } from 'layouts/company/boardDetails/Index';
import { LandingPage } from 'layouts/user/profile/Index';
import { ProfileSettingsPage } from 'layouts/user/settings/Index';
import { FeedPage } from 'layouts/company/feed/Index';
import { HomePage } from 'layouts/landing/Index';
import { TaskDetails } from 'layouts/company/taskDetails/Index';

const PrivateRoute = (props: {
	component: any;
	path: string;
	exact: boolean;
}) => {
	return (
		<Route
			path={props.path}
			exact={props.exact}
			render={() =>
				isAuthenticate() ?
					<Layout Component={props.component} />
					: <Redirect to="/home" />
			}
		/>
	);
};

const Demo = () => (<div></div>);

const NoMatch = () => (<div>This page is not available</div>);

export const App = () => (
	<BrowserRouter>
		<Switch>
			<Route
				exact
				path="/home"
				render={() =>
					isAuthenticate() ? <Redirect to="/" /> : <HomePage />
				}
			/>
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
					isAuthenticate() ? <Redirect to="/" /> : <ForgotPasswordPage />
				}
			/>
			<Route
				path="/reset-password/:token"
				render={() =>
					isAuthenticate() ? <Redirect to="/" /> : <ResetPasswordPage />
				}
			/>
			<Route
				path="/verify-account/:token"
				render={() =>
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
				path="/company/:cname/board"
				exact={true}
				component={TaskPage}
			/>
			<PrivateRoute
				path="/company/:cname/board/:boardId"
				exact={true}
				component={BoardDetailsView}
			/>
			<PrivateRoute
				path="/company/:cname/board/:boardId/task/:taskId"
				exact={true}
				component={TaskDetails}
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
