import {
  USER_FETCH_ERROR,
  BASIC_INFO,
  USER_COMPANIES_UPDATE,
  FETCH_USER,
  EDIT_BASIC_INFO,
  ADD_EXPERIENCE,
  EDIT_BASIC_INFO_ERROR,
  CLEAR_USER_REDUCER_STATE,
  ADD_SKILL,
  DELETE_SKILL,
  PROFILE_IMAGE_UPLOAD,
  COVER_IMAGE_UPLOAD,
  VIDEO_CONFERENCE,
  SAVE_USER_AUTHENTICATION_INFO_SUCCESS,
  SAVE_USER_AUTHENTICATION_INFO_FAILURE,
  TOKEN_VERIFY_START,
  TOKEN_VERIFY_SUCCESS,
  TOKEN_VERIFY_FAILURE,
  REFRESH_USER_INFO_SUCCESS,
  REFRESH_USER_INFO_FAILURE,
  REFRESH_USER_INFO_START,
  SAVE_USER_AUTHENTICATION_INFO_START,
  REFRESH_USER_TOKEN_SUCCESS,
  REFRESH_USER_TOKEN_START,
  REFRESH_USER_TOKEN_FAILURE,
} from './Types';
import { ItemEntityProps } from 'components/fields/SuggestField';
export interface ICompanyByUser {
  role: string;
  company: {
    _id: string;
    name: string;
    uniqueName: string;
    logo?: string;
  };
}
export interface IProfilePhoto {
  _id: string;
  link: string;
  s3key: string;
  type: string;
}
export interface IExperience {
  _id: string;
  name: string;
  qualification: string;
  startYear: string;
  endingYear: string;
  currentStatus: boolean;
  description: string;
}
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  accountVerified: boolean;
  role: string;
  contactNo: string;
  gender: string;
  secondaryEmail: string;
  bloodGroup: string;
  location: string;
  about: string;
  birthDate: Date;
  companies: ICompanyByUser[];
  timeline: string[];
  skillArea: ItemEntityProps[];
  profileImage: string;
  coverImage: string;
  position: string;
  complete: number;
  teamNumber: number;
  videos: [];
}

const InitialState = {
  user: {
    _id: '',
    email: '',
    firstName: '',
    lastName: '',
    name: '',
    accountVerified: false,
    role: '',
    contactNo: '',
    gender: '',
    secondaryEmail: '',
    bloodGroup: '',
    location: '',
    about: '',
    birthDate: '',
    companies: [],
    friends: [],
    pendingFriends: [],
    sendingFriendList: [],
    timeline: [],
    skillArea: [],
    profileImage: '',
    coverImage: '',
    position: '',
    complete: 0,
    teamNumber: 0,
    videos: [],
    fetchingUser: true,
  },
  error: '',
};

export const UserReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case USER_FETCH_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case BASIC_INFO:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case EDIT_BASIC_INFO:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case ADD_SKILL:
      return {
        ...state,
        user: {
          ...state.user,
          skillArea: [...action.payload],
        },
      };
    case DELETE_SKILL:
      return {
        ...state,
        user: {
          ...state.user,
          skillArea: [...action.payload],
        },
      };
    case USER_COMPANIES_UPDATE:
      return {
        ...state,
        user: {
          ...state.user,
          companies: action.payload.companies,
        },
      };
    case FETCH_USER:
      return {
        ...state,
        user: action.payload,
        fetchingUser: false,
      };
    case ADD_EXPERIENCE: {
      return {
        ...state,
        user: {
          ...state.user,
          timeline: action.payload,
        },
      };
    }
    case EDIT_BASIC_INFO_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case CLEAR_USER_REDUCER_STATE:
      return {
        ...InitialState,
      };
    case PROFILE_IMAGE_UPLOAD: {
      return {
        ...state,
        user: {
          ...state.user,
          profileImage: action.payload.link,
        },
      };
    }
    case COVER_IMAGE_UPLOAD: {
      return {
        ...state,
        user: {
          ...state.user,
          coverImage: action.payload.link,
        },
      };
    }
    case VIDEO_CONFERENCE: {
      return {
        ...state,
        user: {
          ...state.user,
          videos: action.payload,
        },
      };
    }
    case SAVE_USER_AUTHENTICATION_INFO_START:
      return {
        ...state,
        accountUpdateLoading: true,
        accountUpdateError: '',
      };
    case SAVE_USER_AUTHENTICATION_INFO_SUCCESS:
      return {
        ...state,
        accountUpdateLoading: false,
      };
    case SAVE_USER_AUTHENTICATION_INFO_FAILURE:
      return {
        ...state,
        accountUpdateLoading: false,
        accountUpdateError: action.payload,
      };
    case TOKEN_VERIFY_START:
      return {
        ...state,
        tokenVerificationProcessing: true,
        tokenVerificationError: '',
      };
    case TOKEN_VERIFY_SUCCESS:
      return {
        ...state,
        tokenVerifiedSuccess: true,
        tokenVerificationProcessing: false,
      };
    case TOKEN_VERIFY_FAILURE:
      return {
        ...state,
        tokenVerificationError: action.payload,
        tokenVerifiedSuccess: false,
        tokenVerificationProcessing: false,
      };
    case REFRESH_USER_INFO_START:
      return {
        ...state,
        informationRefreshedLoading: true,
        informationRefreshedError: '',
      };
    case REFRESH_USER_INFO_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        informationRefreshedLoading: false,
      };
    case REFRESH_USER_INFO_FAILURE:
      return {
        ...state,
        informationRefreshedLoading: false,
        informationRefreshedError: action.payload,
      };
    case REFRESH_USER_TOKEN_START:
      return {
        ...state,
        tokenRefreshedLoading: true,
        tokenRefreshedError: '',
      };
    case REFRESH_USER_TOKEN_SUCCESS:
      return {
        ...state,
        tokenRefreshedLoading: false,
      };
    case REFRESH_USER_TOKEN_FAILURE:
      return {
        ...state,
        tokenRefreshedLoading: false,
        tokenRefreshedError: action.payload,
      };
    default:
      return state;
  }
};
