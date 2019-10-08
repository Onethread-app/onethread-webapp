import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { SignUpPage } from "./pages/SignupPage";
import { LandingPage } from "pages/LandingPage";
import { SignInPage } from "pages/SignInPage";
import { connect } from "react-redux";
import { isAuthenticate } from "actions/UtilsActions";
import { RoomPage } from "pages/company/workplace/RoomPage";
import { FeedPage } from "pages/company/workplace/FeedPage";
import { CompanyProfilePage } from 'pages/company/ProfilePage';
import { Layout } from 'components/common/Layout';
import { ChatkitTest } from 'pages/ChatkitTest';

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

const AppComponent = () => {

	return (
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
					path="/chatkit"
					exact={true}
					component={ChatkitTest}
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
};

export const App = connect(
	null,
	null,
)(AppComponent);
