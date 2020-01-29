import { isEqual } from 'lodash';

export interface Entity {
  _id?: string;
  name: string;
}

export const tokenConfig = () => {
  const token = typeof window !== undefined && localStorage.getItem('token') ?
    JSON.parse(localStorage.getItem('token')!) : null;
  return {
    headers: {
      'Content-type': 'application/json',
      'Authorization': token
    }
  };
};

export const isAuthenticate = () => {
  if (typeof window === undefined) {
    return false;
  }
  if (localStorage.getItem('token')) {
    return JSON.parse(localStorage.getItem('token')!);
  } else {
    return false;
  }
};

export const permit = (companyRole: string): boolean => {
  if (isEqual(companyRole, 'superAdmin') || isEqual(companyRole, 'admin')) {
    return true;
  } else {
    return false;
  }
};

export const showAddMember = (roomName: string, companyRole: string): boolean => {
  if (isEqual(roomName, 'General')) {
    return false;
  } else if (permit(companyRole)) {
    return true;
  } else {
    return false;
  }
};

export const passwordValidation = (password: string) => {
  const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
  if (password.match(regex)) {
    return true;
  } else {
    return false;
  }
};

export const boardColor = [
  { code: 0, value: '#FA617F' },
  { code: 1, value: '#A8D16B' },
  { code: 2, value: '#FFD7D0' },
  { code: 3, value: '#FE5E41' },
  { code: 4, value: '#3F61C5' },
  { code: 5, value: '#11B468' },
  { code: 6, value: '#5A1DD6' }
];

export const priorityColor = [
  { code : 0, name : 'Highest', value: '#C43600', container: '#F9E9E3' },
  { code : 1, name : 'High', value: '#CB5800', container: '#F9EDE3' },
  { code : 2, name : 'Medium', value: '#D48A0B', container: '#FFF5E3' },
  { code : 3, name : 'Low', value: '#5387AF', container: '#ECF2F6' },
  { code : 4, name : 'Lowest', value: '#093F68', container: '#E4EAEE' },
];