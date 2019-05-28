const permit = (...allowed) => {
    const isAllowed = role => allowed.indexOf(role) > -1;
    
    // return a middleware
    return (request, response, next) => {
      if (request.user && isAllowed(request.user.role))
        next(); // role is allowed, so continue on the next middleware
      else {
        response.status(403).json({message: "Forbidden"}); // user is forbidden
      }
    }
}

const authSelf= (content, model ="user") => { 
  // return a middleware
  return (request, response, next) => {
    if (request.user._id == request[content].user)
      next(); // role is allowed, so continue on the next middleware
    else {
      response.status(403).json({message: "Forbidden"}); // user is forbidden
    }
  }
}


module.exports= {permit, authSelf};
