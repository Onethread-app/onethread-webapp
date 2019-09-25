// Setup config/headers and token
export const tokenConfig = (getState:any) => {
  const token = getState().authReducer.token;
  return {
    headers: {
      "Content-type": "application/json",
      "Authorization": token ? token : null
    }
  };
};

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