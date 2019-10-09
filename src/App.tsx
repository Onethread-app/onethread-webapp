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
			<Route component={NoMatch} />
		</Switch>

	</BrowserRouter>
);