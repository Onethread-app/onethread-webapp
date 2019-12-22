const _ = require('lodash');
const { sendErrorResponse } = require('../helpers/jsonResponse');

module.exports = (_schema, useJoiError = true) => {
  const _useJoiError = _.isBoolean(useJoiError) && useJoiError;

  // Joi validation options
  const _validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
  };

  // return the validation middleware
  return (req, res, next) => {
    _schema
      .validate(req, _validationOptions)
      .then(validatedChanges => {
        req.body = validatedChanges.body;
        next();
        return null;
      })
      .catch(validationError => {
        const errors = validationError.details.map(d => {
          return {
            message: d.message.replace(/['"]/g, ''),
            fieldName: d.path[1],
          };
        });
        const customError =
          'Invalid request data. Please review request and try again.';
        return sendErrorResponse(
          res,
          400,
          'ValidationError',
          _useJoiError ? errors : customError,
        );
      });
  };
};
