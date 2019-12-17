const _ = require('lodash');

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
        const JoiError = {
          type: 'ValidationError',
          errors: validationError.details.map(d => {
            return {
              message: d.message.replace(/['"]/g, ''),
              fieldName: d.path[1],
            };
          }),
        };
        // Custom Error
        const CustomError = {
          status: 'failed',
          error:
            'Invalid request data. Please review request and try again.',
        };

        res.status(400).send(_useJoiError ? JoiError : CustomError);
      });
  };
};
