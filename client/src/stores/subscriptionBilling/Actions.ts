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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)
=======
>>>>>>> 4754c34c... Bug fix paymment (#250)

export const createSubscription = (subscriptionId) => ({
  type: subscription.CREATE_SUBSCRIPTION_SUCESS,
  payload: subscriptionId,
});
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> cdf1363f... Feature/tig 224 (#231)
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)
=======
>>>>>>> 4754c34c... Bug fix paymment (#250)
