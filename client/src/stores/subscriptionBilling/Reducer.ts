import { subscription } from './Type';

const initialState = {
  paymentHistory: [],
  subscriptions: [],
  currentSubscriptions: undefined,
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
    default:
      return state;
  }
};
