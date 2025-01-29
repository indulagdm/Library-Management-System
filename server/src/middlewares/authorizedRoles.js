const CustomError = require("./CustomError");

const authorizedRoles = (...allowedRole) => {
  return (req, res, next) => {
    if (!req.user || !allowedRole.includes(req.user.role)) {
      return next(
        new CustomError("You are unauthorized for process this action.",401)
      );
    }
    next();
  };
};

module.exports = authorizedRoles;
