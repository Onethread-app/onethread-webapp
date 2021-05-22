const handleError = async (error, errorHandler) => {
  if (error.response) {
    const { data, config } = error.response;
    console.log(
      `${data.type} on method ${config.method} at ${config.baseURL}${config.url}`,
    );
    if (data.type === 'Network Error') {
      await errorHandler('Network Error');
    } else if (data.status === 400) {
      await errorHandler('Bad Request');
    } else if (data.status === 401) {
      await errorHandler(
        'Unauthorized user. Please enter valid email and password.',
      );
    } else if (data.status === 403) {
      await errorHandler('Access Error');
    } else if (data.status === 404) {
      await errorHandler('Method Not Found');
      window.location.href = '/notFound';
    } else {
      await errorHandler(data.type);
    }
  }
};

export default handleError;
