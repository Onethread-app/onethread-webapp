import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { SignUpPage } from "./pages/SignupPage";
import { LandingPage } from "pages/LandingPage";
import { SignInPage } from "pages/SignInPage";
import { connect } from "react-redux";
import { fetchUserAction } from "actions/AuthActions";
import { initializeChatkitAction } from "actions/ChatkitActions";
import { useEffect } from "react";
import { isAuthenticate } from "actions/UtilsActions";
import { RoomPage } from "pages/company/workplace/RoomPage";
import { FeedPage } from "pages/company/workplace/FeedPage";
import { CompanyProfilePage } from 'pages/company/ProfilePage';
import { Layout } from 'components/common/Layout';

const load = async (
	fetchUserAction: () => void,
	initializeChatkitAction: () => void
) => {
	await fetchUserAction();
	await initializeChatkitAction();
}

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

interface AppProps {
	fetchUserAction: () => void;
	initializeChatkitAction: () => void;
}

const AppComponent = (props: AppProps) => {
	useEffect(() => {
		load(props.fetchUserAction, props.initializeChatkitAction);
	});

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
					path="/"
					exact={true}
					component={LandingPage}
				/>
				<PrivateRoute
					exact={true}
					path="/company"
					component={CompanyProfilePage}
				/>
				<PrivateRoute
					path="/workplace"
					exact={true}
					component={FeedPage}
				/>
				<PrivateRoute
					path="/workplace/room"
					exact={true}
					component={RoomPage}
				/>
			</Switch>

		</BrowserRouter>
	);
};

export const App = connect(
	null,
	{ fetchUserAction, initializeChatkitAction }
)(AppComponent);
