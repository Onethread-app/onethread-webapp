import { USER_SIGNUP, USER_LOGIN, USER_LOGIN_ERROR, FETCH_USER, USER_SIGNUP_LOADING } from './Types'
import tigrowApi from 'tigrowApi';
import { AxiosRequestConfig } from 'axios';
import { History } from 'history';
import { UserModel } from 'reducers/AuthReducer';
import { isEqual } from 'lodash';
import { tokenConfig } from './UtilsActions';

export const userSignupAction = (newUser: UserModel, routeHistory: History) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_SIGNUP_LOADING });
    const response = await tigrowApi.post(
      "account/signup",
      newUser,
      {
        "Content-Type": "application/json",
      } as AxiosRequestConfig
    );
    localStorage.setItem("token", JSON.stringify(response.data.token));
    routeHistory.push('/landing');
    dispatch({ type: USER_SIGNUP, payload: response.data });
  } catch (error) {
    console.log(error.response);
  }
}

export const loginAction = (loginUser: UserModel, routeHistory: History) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_SIGNUP_LOADING });
    const response = await tigrowApi.post(
      "account/login",
      loginUser,
      {
        "Content-Type": "application/json",
      } as AxiosRequestConfig
    );
    localStorage.setItem("token", JSON.stringify(response.data.token));
    routeHistory.push('/landing');
    dispatch({ type: USER_LOGIN, payload: response.data });
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: USER_LOGIN_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: USER_LOGIN_ERROR, payload: 'Unauthorized user. Please enter valid email and password.' });
    } else {
      console.log(error.response);
    }
  }
}

export const fetchUserAction = () => async (dispatch: any, getState: any) => {
  try {
    dispatch({ type: USER_SIGNUP_LOADING });
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      const response = await tigrowApi.get(`/account`, headers);
      dispatch({ type: FETCH_USER, payload: response.data });
    } else {
      dispatch({ type: USER_LOGIN_ERROR, payload: 'error in fetching' });
    }
  } catch (error) {
    console.log(error);
  }
}

