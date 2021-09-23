import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import {
  GET_ALL_ASSOCIATE,
  SELECT_ASSOCIATE,
  ADD_ASSOCIATE,
  GET_ALL_PENDING_ASSOCIATE,
  associate,
} from './Types';

export interface Associate {
  _id: string;
  associateCompany: ICompany;
  company: ICompany;
  account: User;
  createdAt: string;
}
export interface AssociateModel {
  currentAssociate: Associate;
  associatesList: Associate[];
  pendingAssociates: Associate[];
}

const InitialState = {
  associatesList: [],
  pendingAssociates: [],
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
  associateFetching: false,
  associateFetchingError: undefined,
};

export const AssociateReducer = (state = InitialState, action: any) => {
  switch (action.type) {
    case GET_ALL_ASSOCIATE:
      return {
        ...state,
        associatesList: action.payload,
      };
    case GET_ALL_PENDING_ASSOCIATE:
      return {
        ...state,
        pendingAssociates: action.payload,
      };
    case ADD_ASSOCIATE:
      return {
        ...state,
        associatesList: [...state.associatesList, action.payload],
      };
    // case ADD_ASSOCIATE_IN_PENDING_LIST:
    //   return {
    //     ...state,
    //     pendingAssociates: [
    //       ...state.pendingAssociates,
    //       action.payload
    //     ]
    //   };
    case SELECT_ASSOCIATE:
      return {
        ...state,
        currentAssociate: action.payload,
      };
    case associate.SELECT_ASSOCIATE_START:
      return {
        ...state,
        associateFetching: true,
      };
    case associate.SELECT_ASSOCIATE_SUCCESS:
      return {
        ...state,
        associateFetching: false,
        currentAssociate: action.payload,
      };
    case associate.SELECT_ASSOCIATE_FAILURE:
      return {
        ...state,
        associateFetching: false,
        associateFetchingError: action.payload,
      };
    default:
      return state;
  }
};
