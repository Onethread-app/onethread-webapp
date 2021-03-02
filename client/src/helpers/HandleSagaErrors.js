const handleError = async (error, errorHandler) => {
  if (error.message === 'Network Error') {
    await errorHandler('Network Error');
  } else if (error.response.status === 401) {
    await errorHandler(
      'Unauthorized user. Please enter valid email and password.',
    );
  } else {
    console.log(error.response);
    await errorHandler(error.message);
  }
};

export default handleError;