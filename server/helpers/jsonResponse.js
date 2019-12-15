const sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

const sendErrorResponse = function(res, status, type, content) {
  console.log(type);
  let errorBody = {
    type: type || 'CustomError',
    errors: [content],
  };
  console.log(errorBody);
  res.status(status);
  res.json(errorBody);
};

module.exports = { sendJSONresponse, sendErrorResponse };
