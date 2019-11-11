import { isEqual } from 'lodash';

export interface Entity {
  _id?: string,
  name: string,
}
// Setup config/headers and token
export const tokenConfig = (getState: any) => {
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

export const permit = (companyRole: string): boolean => {
  if (isEqual(companyRole, "superAdmin") || isEqual(companyRole, "admin")) {
    return true;
  } else {
    return false;
  }
}

export const showAddMember = (roomName: string, companyRole: string): boolean => {
  if (isEqual(roomName, "General")) {
    return false;
  } else if (permit(companyRole)) {
    return true;
  } else {
    return false;
  }
}