import {
<<<<<<< HEAD
	GET_ALL_ASSOCIATE,
	SELECT_ASSOCIATE,
	ADD_ASSOCIATE,
	GET_ALL_PENDING_ASSOCIATE
=======
  GET_ALL_ASSOCIATE,
  SELECT_ASSOCIATE,
  ADD_ASSOCIATE,
  GET_ALL_PENDING_ASSOCIATE,
  GET_PROJECT_ASSOCIATES,
>>>>>>> c885f026... add associates in the project (#19)
} from './Types';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';

export interface Associate {
	_id: string;
	associateCompany: ICompany;
	company: ICompany;
	account: User;
	createdAt: string;
}
export interface AssociateModel {
<<<<<<< HEAD
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
=======
  currentAssociate: Associate;
  associatesList: Associate[];
  pendingAssociates: Associate[];
  projectAssociates: Associate[];
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
>>>>>>> c885f026... add associates in the project (#19)
};

export const AssociateReducer = (
	state = InitialState,
	action: any,
) => {
<<<<<<< HEAD
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
			default:
					return state;
	}
=======
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
    case GET_PROJECT_ASSOCIATES:
      return {
        ...state,
        projectAssociates: action.payload,
      };
    default:
      return state;
  }
>>>>>>> c885f026... add associates in the project (#19)
};
