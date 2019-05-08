const User = require('./user.model');

const sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

const register = (req, res) => { 
  
    const user = new User(req.body);
    // we should write .then() function here during refactoring
    user.save(function(err) {
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
          "token" : token
        });
    });
  }

module.exports = { sendJSONresponse, register };
