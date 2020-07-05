import { subscription } from './Type';

const initialState = {
  paymentHistory: [],
  subscriptions: [],
  currentSubscriptions: undefined,
  subscriptionId: '',
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

    case subscription.CREATE_SUBSCRIPTION_SUCESS:
      return {
        ...state,
        subscriptionId: action.payload,
      };
    default:
      return state;
  }
};
