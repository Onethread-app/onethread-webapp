import { subscription } from './Type';

const initialState = {
  paymentHistory: [],
  subscriptions: [],
  currentSubscriptions: undefined,
  subscriptionId: '',
  subscriptionExpired: false,
  massageShown: false,
  checkingValidity: false,
  couponValid: null,
  couponError: '',
  coupon: [],
  totalMembers: 0,
  gettingMembers: false,
  gettingMembersError: '',
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
    case subscription.CHECK_COUPON_VALIDITY_START:
      return {
        ...state,
        checkingValidity: true,
      };
    case subscription.CHECK_COUPON_VALIDITY_SUCCESS:
      return {
        ...state,
        couponValid: action.payload.validity,
        coupon: action.payload.data,
        checkingValidity: false,
      };
    case subscription.CHECK_COUPON_VALIDITY_FAILURE:
      return {
        ...state,
        couponError: action.payload,
        checkingValidity: false,
        couponValid: false,
      };
    case subscription.GET_TOTAL_MEMBER_START:
      return {
        ...state,
        gettingMembers: true,
      };
    case subscription.GET_TOTAL_MEMBER_SUCCESS:
      return {
        ...state,
        totalMembers: action.payload,
        gettingMembers: false,
      };
    case subscription.GET_TOTAL_MEMBER_FAILURE:
      return {
        ...state,
        gettingMembersError: action.payload,
        gettingMembers: false,
      };
    default:
      return state;
  }
};
