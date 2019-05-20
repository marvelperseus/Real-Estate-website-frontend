const jwt = require('jsonwebtoken');
const { agent, admin, superAdmin } = require('../../constants/userTypes');

function isAuthorizedMiddleware(req, res, next) {
  const { jwtData, jwtSignature } = req.cookies;
  if (!jwtData || !jwtSignature) {
    req.isAuthorized = false;
    next();
    return;
  }
  const fullJwt = `${jwtData}.${jwtSignature}`;

  jwt.verify(
    fullJwt,
    process.env.SECRET,
    { ignoreExpiration: true },
    (err, decoded) => {
      if (err) {
        req.isAuthorized = false;
        next();
        return;
      }
      req.isAuthorized = true;
      req.jwtPayload = decoded;
      req.canAccessBackend =
        decoded && [agent, admin, superAdmin].includes(decoded.role);
      req.isAdmin = decoded && [admin, superAdmin].includes(decoded.role);
      next();
    }
  );
}

module.exports = {
  isAuthorizedMiddleware,
};
