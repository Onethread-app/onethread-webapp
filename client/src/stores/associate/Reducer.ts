import { associate } from './Types';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';

export interface Associate {
  _id: string;
  associateCompany: ICompany;
  account: User;
  createdAt: string;
}

export interface AssociateModel {
  currentAssociate: Associate;
  associatesList: Associate[];
  pendingAssociates: Associate[];
  projectAssociates: Associate[];
  sendingRequestSuccess: boolean;
  error: String;
}

const InitialState = {
  associatesList: [],
  pendingAssociates: [],
  projectAssociates: [],
  currentAssociate: {
    _id: '',
    associateCompany: {
      _id: '',
      name: '',
      type: '',
      email: '',
      address: '',
      legalOwnerName: '',
      legalOwnerMail: '',
      logo: '',
    },
    account: {
      _id: '',
      firstName: '',
      lastName: '',
    },
    createdAt: '',
  },
  sendingRequestSuccess: false,
  associateAdded: false,
  associateRejected: false,
  error: '',
};

export const AssociateReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case associate.GET_ASSOCIATE_SUCCSESS:
      return {
        ...state,
        associatesList: action.payload,
      };
    case associate.GET_ASSOCIATE_FAIL:
      return {
        ...state,
        error: action.error,
      };
    case associate.GET_ALL_PENDING_ASSOCIATE_SUCCSESS:
      return {
        ...state,
        pendingAssociates: action.payload,
      };
    case associate.SEND_REQUEST_SUCCESS:
      return {
        ...state,
        sendingRequestSuccess: true,
      };
    case associate.CLOSE_TOASTER:
      return {
        ...state,
        sendingRequestSuccess: false,
      };
    case associate.SEND_REQUEST_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case associate.ACCEPT_ASSOCIATE_REQUEST_SUCCESS:
      return {
        ...state,
        associateAdded: true,
      };
    case associate.REJECT_ASSOCIATE_REQUEST_SUCCESS:
      return {
        ...state,
        associateRejected: true,
      };
    case associate.GET_PROJECT_ASSOCIATES_SUCCESS:
      return {
        ...state,
        projectAssociates: action.payload,
      };
    default:
      return state;
  }
};
