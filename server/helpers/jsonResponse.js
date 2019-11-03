const sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports = { sendJSONresponse };
