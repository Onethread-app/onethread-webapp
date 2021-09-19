import {
  COMPANY_DEPARTMENT_LOADING,
  COMPANY_REDUCER_LOADING,
  COMPANY_REDUCER_LOADING_FALSE,
  CLEAR_COMPANY_REDUCER_STATE,
  CLEAR_CHANGE_COMPANY_NAME_ERROR,
  CLEAR_ADD_DEPARTMENT_ERROR,
  ADD_PRODUCT,
  ADD_TOTAL_ASSOCIATE,
  ADD_TOTAL_MEMBER,
  SET_INITIAL_CURRENT_COMPANY,
  CompanyActionTypes,
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
    // contactNo: string;
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
  colleagueError: string;
  invitingColleague: boolean;
  errorOnInvitingColleague: string;
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
  completedTasks: [],
  creatingCompany: false,
  loadingCompletedTasks: false,
  completedTaskserror: '',
  loading: false,
  gettingCompanyDetails: false,
  logoLoading: false,
  changeCompanyNameLoading: false,
  departmentNameLoading: false,
  designationLoading: false,
  invitingColleague: false,
  error: '',
  errorOnGettingCompanyDetails: '',
  errorOnCreatingCompany: '',
  errorOnInvitingColleague: '',
  colleagueError: '',
};

export const CompanyReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case COMPANY_REDUCER_LOADING:
    case COMPANY_REDUCER_LOADING_FALSE:
    case CompanyActionTypes.GET_ALL_PRODUCT_START:
    case CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_START:
    case CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_START:
    case CompanyActionTypes.EDIT_ORGANIZATION_START:
    case CompanyActionTypes.ADD_ORGANIZATION_START:
    case CompanyActionTypes.ADD_COMPANY_CERTIFICATE_START:
    case CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_START:
    case CompanyActionTypes.CHANGE_MEMBER_ROLE_START:
    case CompanyActionTypes.CHANGE_COMPANY_LOGO_START:
    case CompanyActionTypes.EDIT_COMPANY_INFO_START:
    case CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_START:
    case CompanyActionTypes.DELETE_COMPANY_MEMBER_START:
    case CompanyActionTypes.ADD_TEAM_MEMBER_START:
    case CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_START:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case CompanyActionTypes.GET_ALL_PRODUCT_FAILURE:
    case CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_FAILURE:
    case CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_FAILURE:
    case CompanyActionTypes.EDIT_ORGANIZATION_FAILURE:
    case CompanyActionTypes.ADD_ORGANIZATION_FAILURE:
    case CompanyActionTypes.ADD_COMPANY_CERTIFICATE_FAILURE:
    case CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_FAILURE:
    case CompanyActionTypes.CHANGE_MEMBER_ROLE_FAILURE:
    case CompanyActionTypes.CHANGE_COMPANY_LOGO_FAILURE:
    case CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_FAILURE:
    case CompanyActionTypes.DELETE_COMPANY_MEMBER_FAILURE:
    case CompanyActionTypes.ADD_TEAM_MEMBER_FAILURE:
    case CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CompanyActionTypes.CREATE_COMPANY_START:
      return {
        ...state,
        creatingCompany: true,
        errorOnCreatingCompany: '',
        companyCreated: false,
      };
    case CompanyActionTypes.CREATE_COMPANY_SUCCESS:
      return {
        ...state,
        currentCompany: action.payload.company,
        creatingCompany: false,
        companyCreated: true,
      };
    case CompanyActionTypes.CREATE_COMPANY_FAILURE:
      return {
        ...state,
        errorOnCreatingCompany: action.payload,
        creatingCompany: false,
      };
    case CompanyActionTypes.GET_COMPANY_DETAILS_START:
      return {
        ...state,
        errorOnGettingCompanyDetails: '',
        gettingCompanyDetails: true,
      };

    case CompanyActionTypes.GET_COMPANY_DETAILS_SUCCESS:
      return {
        ...state,
        currentCompany: action.payload,
        gettingCompanyDetails: false,
      };
    case CompanyActionTypes.GET_COMPANY_DETAILS_FAILURE:
      return {
        ...state,
        errorOnGettingCompanyDetails: action.payload,
        gettingCompanyDetails: false,
      };
    case CompanyActionTypes.GET_ALL_COMPANY_MEMBERS_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          members: action.payload.members,
        },
        loading: false,
      };
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
    case CompanyActionTypes.DELETE_COMPANY_MEMBER_SUCCESS:
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
    case CompanyActionTypes.GET_ALL_COMPANY_PENDING_MEMBERS_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          pendingMembers: action.payload,
        },
        loading: false,
      };
    case COMPANY_DEPARTMENT_LOADING:
      return {
        ...state,
        departmentNameLoading: true,
      };
    case CompanyActionTypes.ADD_DEPARTMENT_START:
      return {
        ...state,
        departmentNameLoading: true,
      };
    case CompanyActionTypes.ADD_DEPARTMENT_FAILURE:
      return {
        ...state,
        error: action.payload,
        departmentNameLoading: false,
      };
    case CompanyActionTypes.ADD_DEPARTMENT_SUCCESS:
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
      };
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
      };
    case CompanyActionTypes.EDIT_COMPANY_INFO_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          ...action.payload,
        },
        loading: false,
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
    case CompanyActionTypes.ADD_DESIGNATION_START:
      return {
        ...state,
        designationLoading: true,
      };
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
      };
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
    case CompanyActionTypes.CHANGE_COMPANY_OPTIONAL_ROLE_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          optionalRole: action.payload,
        },
        loading: false,
      };
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
    case CompanyActionTypes.EDIT_ORGANIZATION_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          parentcom: action.payload,
        },
        loading: false,
      };
    case CompanyActionTypes.GET_ALL_COMPANY_ANNOUNCEMENT_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          announce: action.payload,
        },
        loading: false,
      };
    case CompanyActionTypes.ADD_COMPANY_ANNOUNCEMENT_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case CompanyActionTypes.GET_ALL_PRODUCT_SUCCESS:
      return {
        ...state,
        currentCompany: {
          ...state.currentCompany,
          products: action.payload,
        },
        loading: false,
      };
    case CompanyActionTypes.COLLEAGUE_INVITE_START:
      return {
        ...state,
        invitingColleague: true,
        errorOnInvitingColleague: '',
      };
    case CompanyActionTypes.COLLEAGUE_INVITE_SUCCESS:
      return {
        ...state,
        invitingColleague: false,
      };
    case CompanyActionTypes.COLLEAGUE_INVITE_FAILURE:
      return {
        ...state,
        errorOnInvitingColleague: action.payload,
        invitingColleague: false,
      };
    case CompanyActionTypes.GET_LATEST_COMPLETED_TASK_START:
      return {
        ...state,
        loadingCompletedTasks: true,
      };
    case CompanyActionTypes.GET_LATEST_COMPLETED_TASK_SUCCESS:
      return {
        ...state,
        completedTasks: action.payload,
        loadingCompletedTasks: false,
      };
    case CompanyActionTypes.GET_LATEST_COMPLETED_TASK_FAILURE:
      return {
        ...state,
        completedTaskserror: action.payload,
        loadingCompletedTasks: false,
      };
    case CompanyActionTypes.CLEAR_COMPANY_ERROR:
      return {
        ...state,
        error: '',
      };
    case CompanyActionTypes.UPDATE_COMPANY_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CompanyActionTypes.CLEAR_ERROR_ON_COMPANY_CREATE:
      return {
        ...state,
        errorOnCreatingCompany: '',
      };
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
    case CLEAR_CHANGE_COMPANY_NAME_ERROR:
      return {
        ...state,
        error: '',
        changeCompanyNameLoading: false,
      };
    case CLEAR_COMPANY_REDUCER_STATE:
      return {
        ...InitialState,
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
    case CompanyActionTypes.FIND_COMPANY_BY_NAME_START:
      return {
        ...state,
        companySearchLoading: true,
        companySearchFailure: false,
      };
    case CompanyActionTypes.FIND_COMPANY_BY_NAME_SUCCESS:
      return {
        ...state,
        companySearchResults: action.payload,
        companySearchLoading: false,
      };
    case CompanyActionTypes.FIND_COMPANY_BY_NAME_FAILURE:
      return {
        ...state,
        companySearchFailure: action.payload,
        companySearchLoading: false,
      };
    case CompanyActionTypes.JOIN_COMPANY_REQUEST_START:
      return {
        ...state,
        companyJoinRequestLoading: true,
        companyJoinRequestFailure: '',
      };
    case CompanyActionTypes.JOIN_COMPANY_REQUEST_SUCCESS:
      return {
        ...state,
        companyJoinRequestLoading: false,
      };
    case CompanyActionTypes.JOIN_COMPANY_REQUEST_FAILURE:
      return {
        ...state,
        companyJoinRequestLoading: false,
        companyJoinRequestFailure: action.payload,
      };
    case CompanyActionTypes.PUBLIC_COMPANY_DETAILS_START:
      return {
        ...state,
        publicInformationLoading: true,
        publicInformationError: '',
      };
    case CompanyActionTypes.PUBLIC_COMPANY_DETAILS_SUCCESS:
      return {
        ...state,
        currentCompany: action.payload,
        publicInformationLoading: false,
        publicInformationError: '',
      };
    case CompanyActionTypes.PUBLIC_COMPANY_DETAILS_FAILURE:
      return {
        ...state,
        publicInformationLoading: false,
        publicInformationError: action.payload,
      };
    default:
      return state;
  }
};

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
