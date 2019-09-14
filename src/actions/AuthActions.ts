import { NEW_USER, LOGIN, LOGIN_ERROR } from './Types'
import tigrowApi from 'tigrowApi';
import { AxiosRequestConfig } from 'axios';
import { History } from 'history';
import { UserModel } from 'reducers/AuthReducer';

export const newUserAction = (newUser: UserModel, routeHistory: History) => async (dispatch: any) => {
  try {
    const response = await tigrowApi.post(
      "account/signup",
      newUser,
      {
        "Content-Type": "application/json",
      } as AxiosRequestConfig
    );
    localStorage.setItem("token", JSON.stringify(response.data.token));
    routeHistory.push('/landing');
    dispatch({ type: NEW_USER, payload: response.data });
  } catch (error) {
    console.log(error.response);
  }
}

export const isAuthenticate = () => {
  if (typeof window == undefined) {
    return false;
  }
  if (localStorage.getItem('token')) {
    return JSON.parse(localStorage.getItem('token')!);
  } else {
    return false;
  }
}
export const loginAction = (loginUser: UserModel, routeHistory: History) => async (dispatch: any) => {
  try {
    const response = await tigrowApi.post(
      "account/login",
      loginUser,
      {
        "Content-Type": "application/json",
      } as AxiosRequestConfig
    );
    console.log(response.data.token);
    localStorage.setItem("token", JSON.stringify(response.data.token));
    routeHistory.push('/landing');
    dispatch({ type: LOGIN, payload: response.data });
  } catch (error) {
    if (error.response.status === 401) {
      console.log('mithhu', error.response.status);
      dispatch({ type: LOGIN_ERROR, payload: true });
    } else {
      console.log(error.response);
    }
  }
}


// register
// export const newUserAction = (user: any) => async (dispatch: any) => {
//   try {
//     let headers = {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     };
//     // const response = await nizamBhai.post("account/signup", user, headers);
//     const response = await tigrowApi.post(
//       "account/signup",
//       user,
//       headers as AxiosRequestConfig);
//     // const token = response.data.token;
//     user = response.data.user;
//     // set the token on localStorage
//     // localStorage.setItem("token", token);
//     // dispatch({
//     //   type: NEW_USER,
//     //   payload: { token, user }
//     // });
//     console.log(`response.data: ${JSON.stringify(response.data, null, 2)}`);
//   } catch (err) {
//     // dispatch(returnErrors(err.response.data, err.response.status));
//     console.log(err);
//     console.log(err.response);
//     // dispatch({
//     //   type: REGISTER_FAIL
//     // });
//   }
// };