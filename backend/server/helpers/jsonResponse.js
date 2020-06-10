const sendJSONresponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};

const sendErrorResponse = function (res, status, type, content) {
	const errorBody = {
		status: status,
		type: type || 'CustomError',
		errors: [content],
	};
	res.status(status);
	res.json(errorBody);
};

module.exports = {sendJSONresponse, sendErrorResponse};
