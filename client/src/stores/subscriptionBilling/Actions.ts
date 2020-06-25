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
<<<<<<< HEAD

export const createSubscription = (subscriptionId) => ({
  type: subscription.CREATE_SUBSCRIPTION_SUCESS,
  payload: subscriptionId,
});
=======
>>>>>>> cdf1363f... Feature/tig 224 (#231)
