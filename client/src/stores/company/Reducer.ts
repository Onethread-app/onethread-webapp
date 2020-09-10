import {
  // GET_COMPANY_DETAILS,
  // CREATE_COMPANY,
  ADD_DEPARTMENT,
  ADD_DEPARTMENT_LOADING,
  COMPANY_DEPARTMENT_LOADING,
  ADD_DEPARTMENT_ERROR,
  // GET_ALL_COMPANY_MEMBERS,
  COMPANY_REDUCER_LOADING,
  COMPANY_REDUCER_LOADING_FALSE,
  // GET_ALL_DEPARTMENT,
  CLEAR_COMPANY_REDUCER_STATE,
  // EDIT_COMPANY_INFO,
  // CHANGE_COMPANY_NAME,
  // CHANGE_COMPANY_NAME_ERROR,
  CLEAR_CHANGE_COMPANY_NAME_ERROR,
  // CHANGE_COMPANY_NAME_LOADING,
  CLEAR_ADD_DEPARTMENT_ERROR,
  CREATE_COMPANY_ERROR,
  COMPANY_DESIGNATION_LOADING,
  // ADD_DESIGNATION,
  // ADD_DESIGNATION_ERROR,
  // EDIT_DESIGNATION,
  // EDIT_DESIGNATION_ERROR,
  // LOGO_UPLOAD,
  // COVER_IMAGE_UPLOAD_COMPANY,
  // CHANGE_MEMBER_ROLE,
  // COMPANY_ROLE,
  // UPDATE_ALL_COMPANY_PENDING_MEMBERS,
  // DELETE_TEAM_MEMBER,
  // GET_ALL_COMPANY_PENDING_MEMBERS,
  // ADD_CERTIFICATE,
  // ADD_ORGANIZATION,
  // GET_ALL_COMPANY_ANNOUNCEMENT,
  // ADD_ANNOUNCEMENT,
  // GET_ALL_PRODUCT,
  ADD_PRODUCT,
  ADD_TOTAL_ASSOCIATE,
  ADD_TOTAL_MEMBER,
  // EDIT_ORGANIZATION,
  SET_INITIAL_CURRENT_COMPANY,
  // COLLEAGUE_INVITE_SUCCESS,
  // COLLEAGUE_WENT_WRONG,
  CompanyActionTypes
} from './Types';
import { Entity } from 'stores/UtilsActions';

export interface IOrg {
  ind: number;
  name: string;
}

// tslint:disable-next-line: interface-name
export interface IDesignations {
  _id: string;
  division: string;
  position: string;
  department: { _id: string; name: string };
}

// tslint:disable-next-line: interface-name
export interface ICompanyMembers {
  _id: string;
  account: {
    _id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  role: string;
  designations: [IDesignations];
}

export interface ICompanyTeamMembers {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface ICompanyPendingMembers {
  _id: string;
  email: string;
  removed: boolean;
}

export interface ICertificates {
  _id: string;
  name: string;
  description: string;
}
export interface ICompany {
  _id: string;
  name: string;
  uniqueName: string;
  type: string;
  email: string;
  address: string;
  legalOwnerName: string;
  legalOwnerMail: string;
  divisions: Entity[];
  departments: Entity[];
  members: ICompanyMembers[];
  pendingMembers: ICompanyPendingMembers[];
  role: string;
  about: string;
  skill: [{}];
  logo: string;
  coverImage: string;
  certificate: ICertificates[];
  parentcom: Entity[];
  announce: [];
  products: Entity[];
  totalMember: number;
  totalAssociate: number;
  colleagueInviteSuccess: boolean;
  colleagueError: string;
}

export interface ICompanyResponse {
  data: {
    company: ICompany;
  };
  status: number;
}

const InitialState = {
  currentCompany: {
    _id: '',
    name: '',
    uniqueName: '',
    type: '',
    email: '',
    address: '',
    legalOwnerName: '',
    legalOwnerMail: '',
    members: [],
    pendingMembers: [],
    divisions: [{}],
    departments: [{}],
    role: '',
    about: '',
    skill: [{}],
    logo: '',
    coverImage: '',
    certificate: [],
    parentcom: [],
    announce: [],
    products: [],
    totalMember: 0,
    totalAssociate: 0,
  },
  createCompanyError: {
    message: '',
    network: false,
  },
  loading: false,
  logoLoading: false,
  changeCompanyNameLoading: false,
  departmentNameLoading: false,
  designationLoading: false,
  error: '',
  colleagueInviteSuccess: false,
  colleagueError: '',
};

export const CompanyReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case COMPANY_REDUCER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case COMPANY_REDUCER_LOADING_FALSE:
      return {
        ...state,
        loading: false,
      };
      case CompanyActionTypes.CREATE_COMPANY_START:
        return {
        ...state,
        loading: true,
      }
      case CompanyActionTypes.CREATE_COMPANY_SUCCESS:
      return {
        ...state,
        currentCompany: action.payload.company,
        loading: false,
      };
      case CompanyActionTypes.CREATE_COMPANY_FAILURE:
        return {
          ...state,
          error: action.payload,
      }
    case CompanyActionTypes.GET_COMPANY_DETAILS_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.GET_COMPANY_DETAILS_SUCCESS:
      return {
        ...state,
        currentCompany: action.payload,
        loading: false,
      };
    case CompanyActionTypes.GET_COMPANY_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    // case ADD_TEAM_MEMBERS:
    //   return {
    //     ...state,
    //     currentCompany: {
    //       ...state.currentCompany,
    //       members: [
    //         ...state.currentCompany.members,
    //         action.payload.member
    //       ]
    //     }
    //   }

    case CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          members: action.payload.members,
        },
        loading: false,
      };
    case CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
      case CompanyActionTypes.ADD_TEAM_MEMBER_START:
        return {
          ...state,
          loading: true,
        }
      case CompanyActionTypes.ADD_TEAM_MEMBER_SUCCESS:
        return {
          ...state,
          currentCompany: {
            ...state.currentCompany,
            pendingMembers: state.currentCompany.pendingMembers.concat(
              action.payload.pendingMembers,
            ),
          },
          loading: false,
        };
      case CompanyActionTypes.ADD_TEAM_MEMBER_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
    case CompanyActionTypes.DELETE_TEAM_MEMBER_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.DELETE_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          members: state.currentCompany.members.filter(
            (member: ICompanyMembers) =>
              member._id !== action.payload,
          ),
        },
        loading: false,
      };
    case CompanyActionTypes.DELETE_TEAM_MEMBER_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          pendingMembers: action.payload,
        },
        loading: false,
      };
    case CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case COMPANY_DEPARTMENT_LOADING:
      return {
        ...state,
        departmentNameLoading: true,
      };
    case ADD_DEPARTMENT_LOADING:
      return {
        ...state,
        departmentNameLoading: true,
      };
    case ADD_DEPARTMENT_ERROR:
      return {
        ...state,
        error: action.payload,
        departmentNameLoading: false,
      };
    case ADD_DEPARTMENT:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          departments: [
            ...state.currentCompany.departments,
            action.payload.department,
          ],
        },
        departmentNameLoading: false,
        error: '',
      };
    case CLEAR_ADD_DEPARTMENT_ERROR:
      return {
        ...state,
        error: '',
        departmentNameLoading: false,
      };
    case CompanyActionTypes.GET_ALL_DEPARTMENT_START:
      return {
        ...state,
        departmentNameLoading: true,
      }
    case CompanyActionTypes.GET_ALL_DEPARTMENT_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          departments: action.payload.departments,
        },
        departmentNameLoading: false,
      };
    case CompanyActionTypes.GET_ALL_DEPARTMENT_FAILURE:
      return {
        ...state,
        error: action.payload,
        departmentNameLoading: false,
      }
    case CLEAR_COMPANY_REDUCER_STATE:
      return {
        ...InitialState,
      };
    case CompanyActionTypes.EDIT_COMPANY_INFO_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.EDIT_COMPANY_INFO_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          ...action.payload,
        },
        loading: false,
      };
    case CompanyActionTypes.EDIT_DESIGNATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case CREATE_COMPANY_ERROR:
      return {
        ...state,
        createCompanyError: action.payload,
      };
    case CompanyActionTypes.CHANGE_COMPANY_NAME_START:
      return {
        ...state,
        changeCompanyNameLoading: true,
      };
    case CompanyActionTypes.CHANGE_COMPANY_NAME_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          name: action.payload.name,
          uniqueName: action.payload.uniqueName,
        },
        changeCompanyNameLoading: false,
      };
    case CompanyActionTypes.CHANGE_COMPANY_NAME_FAILURE:
      return {
        ...state,
        error: action.payload,
        changeCompanyNameLoading: false,
      };
    case CLEAR_CHANGE_COMPANY_NAME_ERROR:
      return {
        ...state,
        error: '',
        changeCompanyNameLoading: false,
      };
    case COMPANY_DESIGNATION_LOADING:
      return {
        ...state,
        designationLoading: true,
      };
    case CompanyActionTypes.ADD_DESIGNATION_START:
      return {
        ...state,
        designationLoading: true,
      }
    case CompanyActionTypes.ADD_DESIGNATION_SUCCESS:
      return {
        ...state,
        error: '',
        designationLoading: false,
      };
    case CompanyActionTypes.ADD_DESIGNATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        designationLoading: false,
      };
    case CompanyActionTypes.EDIT_DESIGNATION_START:
      return {
        ...state,
        designationLoading: true,
      }
    case CompanyActionTypes.EDIT_DESIGNATION_SUCCESS:
      return {
        ...state,
        error: '',
        designationLoading: false,
      };
    case CompanyActionTypes.EDIT_DESIGNATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        designationLoading: false,
      };
    case CompanyActionTypes.CHANGE_COMPANY_LOGO_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.CHANGE_COMPANY_LOGO_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          logo: action.payload.link,
        },
        loading: false,
      };
    case CompanyActionTypes.CHANGE_COMPANY_COVER_SUCCESS: 
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          coverImage: action.payload.link,
        },
        loading: false,
      };
    case CompanyActionTypes.CHANGE_COMPANY_LOGO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CompanyActionTypes.CHANGE_MEMBER_ROLE_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.CHANGE_MEMBER_ROLE_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          members: state.currentCompany.members.map(
            (member: ICompanyMembers) => {
              if (action.payload.memberId === member._id) {
                return {
                  ...member,
                  role: action.payload.role,
                };
              } else {
                return member;
              }
            },
          ),
        },
        loading: false,
      };
    case CompanyActionTypes.CHANGE_MEMBER_ROLE_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          optionalRole: action.payload,
        },
        loading: false,
      }
    case CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case CompanyActionTypes.ADD_COMPANY_CERTIFICATE_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.ADD_COMPANY_CERTIFICATE_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          certificate: [
            ...state.currentCompany.certificate,
            action.payload,
          ],
        },
      };
    case CompanyActionTypes.ADD_COMPANY_CERTIFICATE_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case CompanyActionTypes.ADD_ORGANIZATION_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.ADD_ORGANIZATION_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          parentcom: [
            ...state.currentCompany.parentcom,
            action.payload,
          ],
        },
        loading: false,
      };
    case CompanyActionTypes.ADD_ORGANIZATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case CompanyActionTypes.EDIT_ORGANIZATION_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.EDIT_ORGANIZATION_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          parentcom: action.payload,
        },
        loading: false,
      };
    case CompanyActionTypes.EDIT_ORGANIZATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          announce: action.payload,
        },
        loading: false,
      };
    case CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    
    case CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    // case ADD_ANNOUNCEMENT:
    //   return {
    //     ...state,
    //     currentCompany: {
    //       ...state.currentCompany,
    //       announce: [
    //         ...state.currentCompany.announce,
    //         action.payload,
    //       ],
    //     },
    //   };
    case CompanyActionTypes.GET_ALL_PRODUCT_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.GET_ALL_PRODUCT_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          products: action.payload,
        },
        loading: false,
      };
    case CompanyActionTypes.GET_ALL_PRODUCT_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case ADD_PRODUCT:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          products: [
            ...state.currentCompany.products,
            {
              _id: action.payload._id,
              name: action.payload.name,
            },
          ],
        },
        departmentNameLoading: false,
        error: '',
      };
    case ADD_TOTAL_ASSOCIATE:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          totalAssociate: action.payload,
        },
      };
    case ADD_TOTAL_MEMBER:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          totalMember: action.payload,
        },
      };
    case SET_INITIAL_CURRENT_COMPANY:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          _id: action.payload.company._id,
          name: action.payload.company.name,
          uniqueName: action.payload.company.uniqueName,
          role: action.payload.role,
        },
      };
    case CompanyActionTypes.COLLEAGUE_INVITE_START:
      return {
        ...state,
        loading: true,
      }
    case CompanyActionTypes.COLLEAGUE_INVITE_SUCCESS:
      return {
        ...state,
        colleagueInviteSuccess: true,
        loading: false,
      };
    case CompanyActionTypes.COLLEAGUE_INVITE_FAILURE:
      return {
        ...state,
        colleagueError: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
