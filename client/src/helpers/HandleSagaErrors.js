import { store } from 'Store';
import { setSubscriptionExpire } from 'stores/subscriptionBilling/Actions';
import i18next from 'i18next';

export const returnErrorText = (error) => {
  if (error.response) {
    const { data, config } = error.response;

    if (data.type === 'Network Error') {
      return `${i18next.t('app.Error-text.Network-Error')}`;
    } else if (data.status === 400) {
      if (data.type === 'ValidationError') {
        let errorText = '';
        data.errors.forEach((error, i) => {
          errorText += `${i > 1 ? ' ' : ''} ${
            error.message.split(':')[0]
          },`;
        });
        return errorText.replace(/.$/, '.');
      }
      return `${i18next.t('app.Error-text.Bad-Request')}`;
    } else if (data.status === 401) {
      return `${i18next.t('app.Error-text.Unauthorized-user')}`;
    } else if (data.status === 403) {
      if (data.type === 'SubscriptionExpirationError') {
        store.dispatch(setSubscriptionExpire());
      }
      return `${i18next.t('app.Error-text.Access-Error')}`;
    } else if (data.status === 404) {
      return `${i18next.t('app.Error-text.Method-Not-Found')}`;
    } else if (data.status === 409) {
      let errorText = '';
      data.errors.forEach((error, i) => {
        errorText += `${i > 1 ? ' ' : ''} ${
          error.message.split(':')[0]
        },`;
      });
      return errorText.replace(/.$/, '.');
      // `${i18next.t('app.Error-text.Duplicate-Value')}`;
    } else {
      return data.type;
    }
  }
};
// TODO: Show error messages with correct error type.

const handleError = (error, errorHandler) => {
  if (error.response) {
    const { data, config } = error.response;
    // console.log(
    //   `${data.type} on method ${config.method} at ${config.baseURL}${config.url}`,
    // );
    if (data.type === 'Network Error') {
      errorHandler('Network Error');
    } else if (data.status === 400) {
      errorHandler('Bad Request');
    } else if (data.status === 401) {
      errorHandler(
        'Unauthorized user. Please enter valid email and password.',
      );
    } else if (data.status === 403) {
      errorHandler('Access Error');
    } else if (data.status === 404) {
      errorHandler('Method Not Found');
      window.location.href = '/notFound';
    } else if (data.status === 409) {
      errorHandler('Duplicate Value');
    } else {
      errorHandler(data.type);
    }
  }
};

export default handleError;
