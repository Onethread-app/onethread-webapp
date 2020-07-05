import { subscription } from './Type';

const initialState = {
  paymentHistory: [],
  subscriptions: [],
  currentSubscriptions: undefined,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  subscriptionId: '',
=======
>>>>>>> cdf1363f... Feature/tig 224 (#231)
=======
  subscriptionId: '',
>>>>>>> 1d9824de... Bugfix/controller (#259)
=======
  subscriptionId: '',
>>>>>>> 4754c34c... Bug fix paymment (#250)
};
export const SubscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case subscription.GET_PAYMENT_HISTORY_SUCCESS:
      return {
        ...state,
        paymentHistory: action.payload,
      };
    case subscription.GET_SUBSCRIPTIONS_SUCCESS:
      return {
        ...state,
        subscriptions: action.payload,
      };
    case subscription.GET_CURRENT_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        currentSubscriptions: action.payload,
      };
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)
=======
>>>>>>> 4754c34c... Bug fix paymment (#250)

    case subscription.CREATE_SUBSCRIPTION_SUCESS:
      return {
        ...state,
        subscriptionId: action.payload,
      };
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> cdf1363f... Feature/tig 224 (#231)
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)
=======
>>>>>>> 4754c34c... Bug fix paymment (#250)
    default:
      return state;
  }
};
