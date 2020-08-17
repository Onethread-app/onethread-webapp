import { subscription } from './Type';

const initialState = {
  paymentHistory: [],
  subscriptions: [],
  currentSubscriptions: undefined,
  subscriptionId: '',
  subscriptionExpired: false,
  massageShown: false,
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
    case subscription.SUBSCRIPTION_EXPIRED:
      return {
        ...state,
        subscriptionExpired: true,
      };
    case subscription.SUBSCRIPTION_NOT_EXPIRED:
      return {
        ...state,
        subscriptionExpired: false,
      };
    case subscription.EXPIRED_MASSAGE_SHOWN:
      return {
        ...state,
        massageShown: true,
      };
    default:
      return state;
  }
};
