export const returnErrorText = (error) => {
  if (error.response) {
    const { data, config } = error.response;
    console.log(
      `${data.type} on method ${config.method} at ${config.baseURL}${config.url}`,
    );
    if (data.type === 'Network Error') {
      return 'Network Error';
    } else if (data.status === 400) {
      return 'Bad Request';
    } else if (data.status === 401) {
      return 'Unauthorized user. Please enter valid email and password.';
    } else if (data.status === 403) {
      return 'Access Error';
    } else if (data.status === 404) {
      return 'Method Not Found';
    } else if (data.status === 409) {
      return 'Duplicate Value';
    } else {
      return data.type;
    }
  }
};

const handleError = (error, errorHandler) => {
  if (error.response) {
    const { data, config } = error.response;
    console.log(
      `${data.type} on method ${config.method} at ${config.baseURL}${config.url}`,
    );
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
