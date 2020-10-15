import {
  USER_FETCH_ERROR,
  BASIC_INFO,
  // USER_COMPANIES_UPDATE,
  FETCH_USER,
  // EDIT_BASIC_INFO,
  // ADD_EXPERIENCE,
  EDIT_BASIC_INFO_ERROR,
  CLEAR_USER_REDUCER_STATE,
  // ADD_SKILL,
  // DELETE_SKILL,
  PROFILE_IMAGE_UPLOAD,
  COVER_IMAGE_UPLOAD,
  VIDEO_CONFERENCE,
  UserActionTypes,
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
    videos: [],
  },
  error: '',
  isEditingUser: false,
  isCompanyLoading: false,
  companyLoadingError: '',
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
    // case EDIT_BASIC_INFO:
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       ...action.payload,
    //     },
    //   };
    // case ADD_SKILL:
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       skillArea: [...action.payload],
    //     },
    //   };
    // case DELETE_SKILL:
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       skillArea: [...action.payload],
    //     },
    //   };
    case UserActionTypes.USER_COMPANIES_UPDATE_START:
      return {
        ...state,
        isCompanyLoading: true,
      };
    case UserActionTypes.USER_COMPANIES_UPDATE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          companies: action.payload.companies,
        },
        isCompanyLoading: false,
      };
    case UserActionTypes.USER_COMPANIES_UPDATE_FAILURE:
      return {
        ...state,
        companyLoadingError: action.payload,
        isCompanyLoading: false,
      };
    case FETCH_USER:
      return {
        ...state,
        user: action.payload,
      };
    // case ADD_EXPERIENCE: {
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       timeline: action.payload,
    //     },
    //   };
    // }
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

    /********************************/

    case UserActionTypes.EDIT_BASIC_INFO_START:
      return {
        ...state,
        // user: {
        //   ...state.user,
        //   ...action.payload,
        // },
        isEditingUser: true,
      };

    case UserActionTypes.EDIT_BASIC_INFO_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
        isEditingUser: false,
      };

    case UserActionTypes.EDIT_BASIC_INFO_FAILURE:
      return {
        ...state,
        error: action.payload,
        isEditingUser: false,
      };

    // add skill
    case UserActionTypes.ADD_SKILL_START:
      return {
        ...state,
        isEditingUser: true,
      };

    case UserActionTypes.ADD_SKILL_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          skillArea: [...action.payload],
        },
        isEditingUser: false,
      };

    case UserActionTypes.ADD_SKILL_FAILURE:
      return {
        ...state,
        error: action.payload,
        isEditingUser: false,
      };

    // delete skill
    case UserActionTypes.DELETE_SKILL_START:
      return {
        ...state,
        isEditingUser: true,
      };

    case UserActionTypes.DELETE_SKILL_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          skillArea: [...action.payload],
        },
        isEditingUser: false,
      };

    case UserActionTypes.DELETE_SKILL_FAILURE:
      return {
        ...state,
        error: action.payload,
        isEditingUser: false,
      };

    // Add Experiance
    case UserActionTypes.ADD_EXPERIENCE_START:
      return {
        ...state,
        // user: {
        //   ...state.user,
        //   timeline: action.payload,
        // },
        isEditingUser: true,
      };

    case UserActionTypes.ADD_EXPERIENCE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          timeline: action.payload,
        },
        isEditingUser: false,
      };

    case UserActionTypes.ADD_EXPERIENCE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isEditingUser: false,
      };

    // video conf
    case UserActionTypes.VIDEO_CONFERENCE_START: {
      return {
        ...state,
        isEditingUser: true,
      };
    }

    case UserActionTypes.VIDEO_CONFERENCE_SUCCESS: {
      return {
        ...state,
        user: {
          ...state.user,
          videos: action.payload,
        },
        isEditingUser: false,
      };
    }

    case UserActionTypes.VIDEO_CONFERENCE_FAILURE: {
      return {
        ...state,
        error: action.payload,
        isEditingUser: false,
      };
    }
    //   return {
    //     ...state,
    //     editingUser: true,
    //   };

    // case UserActionTypes.ADD_SKILL_SUCCESS:
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       skillArea: [...action.payload],
    //     },
    //     editingUser: false,
    //   };

    // case UserActionTypes.ADD_SKILL_FAILURE:
    //   return {
    //     error: action.payload,
    //     editingUser: false,
    //   };

    // profile image upload
    case UserActionTypes.PROFILE_IMAGE_UPLOAD_START: {
      return {
        ...state,
        // user: {
        //   ...state.user,
        //   profileImage: action.payload.link,
        // },
        isEditingUser: true,
      };
    }

    case UserActionTypes.PROFILE_IMAGE_UPLOAD_SUCCESS: {
      return {
        ...state,
        user: {
          ...state.user,
          profileImage: action.payload.link,
        },
        isEditingUser: false,
      };
    }

    case UserActionTypes.PROFILE_IMAGE_UPLOAD_FAILURE: {
      return {
        ...state,
        error: action.payload,
        editingUser: false,
      };
    }

    // cover image upload
    case UserActionTypes.COVER_IMAGE_UPLOAD_START: {
      return {
        ...state,
        // user: {
        //   ...state.user,
        //   coverImage: action.payload.link,
        // },
        isEditingUser: true,
      };
    }

    case UserActionTypes.COVER_IMAGE_UPLOAD_SUCCESS: {
      return {
        ...state,
        user: {
          ...state.user,
          coverImage: action.payload.link,
        },
        isEditingUser: false,
      };
    }

    case UserActionTypes.COVER_IMAGE_UPLOAD_FAILURE: {
      return {
        ...state,
        error: action.payload,
        editingUser: false,
      };
    }

    // user update
    // case UserActionTypes.USER_COMPANIES_UPDATE_START:
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       companies: action.payload.companies,
    //     },
    //     isEditingUser: false,
    //   };
    // case UserActionTypes.USER_COMPANIES_UPDATE_SUCCESS:
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       companies: action.payload.companies,
    //     },
    //     isEditingUser: false,
    //   };
    // case UserActionTypes.USER_COMPANIES_UPDATE_FAILURE:
    //   return {
    //     ...state,
    //     error: action.payload,
    //     isEditingUser: false,
    //   };

    default:
      return state;
  }
};
