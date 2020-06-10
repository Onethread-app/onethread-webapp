import {
	GET_ALL_ASSOCIATE,
	SELECT_ASSOCIATE,
	ADD_ASSOCIATE,
	GET_ALL_PENDING_ASSOCIATE
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
};

export const AssociateReducer = (
	state = InitialState,
	action: any,
) => {
<<<<<<< HEAD
<<<<<<< HEAD
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
<<<<<<< HEAD
    case associate.GET_PROJECT_ASSOCIATES_SUCCESS:
      return {
        ...state,
        projectAssociates: action.payload,
      };
=======
    case GET_PROJECT_ASSOCIATES:
<<<<<<< HEAD
    return {
      ...state,
      projectAssociates: action.payload,
    };
>>>>>>> f4601c6e... add associates in the project (#19)
=======
      return {
        ...state,
        projectAssociates: action.payload,
      };
>>>>>>> 4e99f05f... code style issue fixed
    default:
      return state;
  }
=======
=======
>>>>>>> 6d92f22e... Dev (#202)
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
<<<<<<< HEAD
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
=======
>>>>>>> 6d92f22e... Dev (#202)
};
