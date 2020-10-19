import { subscription } from './Type';

export const getPaymentHistory = () => ({
  type: subscription.GET_PAYMENT_HISTORY,
});
export const getSubscription = () => ({
  type: subscription.GET_SUBSCRIPTIONS,
});
export const getCurrentSubscription = () => ({
  type: subscription.GET_CURRENT_SUBSCRIPTION,
});

export const createSubscription = (subscriptionId) => ({
  type: subscription.CREATE_SUBSCRIPTION_SUCESS,
  payload: subscriptionId,
});

export const setSubscriptionExpire = () => ({
  type: subscription.SUBSCRIPTION_EXPIRED,
});
export const setSubscriptionNotExpire = () => ({
  type: subscription.SUBSCRIPTION_NOT_EXPIRED,
});

export const setExpireMassage = () => ({
  type: subscription.EXPIRED_MASSAGE_SHOWN,
});

export const checkCouponValidity = (coupon: any) => ({
  type: subscription.CHECK_COUPON_VALIDITY_START,
  payload: coupon
});

export const checkCouponValiditySuccess = (response: any) => ({
  type: subscription.CHECK_COUPON_VALIDITY_SUCCESS,
  payload: response,
});

export const checkCouponValidityFailure = (errorMessage: any) => ({
  type: subscription.CHECK_COUPON_VALIDITY_FAILURE,
  payload: errorMessage,
});