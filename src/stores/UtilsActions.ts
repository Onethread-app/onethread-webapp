import { isEqual } from 'lodash';

export interface Entity {
  _id?: string,
  name: string,
}

export const tokenConfig = () => {
  const token = typeof window !== undefined && localStorage.getItem('token') ? 
  JSON.parse(localStorage.getItem('token')!) : null
  return {
    headers: {
      "Content-type": "application/json",
      "Authorization": token
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

export const passwordValidation = (password: string) => {
  const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
  if (password.match(regex)) {
    return true;
  } else {
    return false
  }
}

export const awsImageOption = (response: any) => {
  const options = {
    params: {
      Key: response.s3Key,
      ContentType: response.type
    }
  };
  return options
}