<<<<<<< HEAD
<<<<<<< HEAD
import {
<<<<<<< HEAD
=======
import {
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
	GET_ALL_ASSOCIATE,
	SELECT_ASSOCIATE,
	ADD_ASSOCIATE,
	GET_ALL_PENDING_ASSOCIATE
<<<<<<< HEAD
=======
  GET_ALL_ASSOCIATE,
  SELECT_ASSOCIATE,
  ADD_ASSOCIATE,
  GET_ALL_PENDING_ASSOCIATE,
  GET_PROJECT_ASSOCIATES,
>>>>>>> c885f026... add associates in the project (#19)
} from './Types';
=======
import { associate } from './Types';
>>>>>>> 0db3de3c... Feat/notification (#198)
=======
} from './Types';
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
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
<<<<<<< HEAD
>>>>>>> c885f026... add associates in the project (#19)
=======
  sendingRequestSuccess: false,
  associateAdded: false,
  associateRejected: false,
  error: '',
>>>>>>> 0db3de3c... Feat/notification (#198)
=======
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
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
};

export const AssociateReducer = (
	state = InitialState,
	action: any,
) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
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
=======
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
>>>>>>> c885f026... add associates in the project (#19)
=======
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
};
