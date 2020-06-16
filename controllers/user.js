const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    //remove salt and hashed_password from user object
    user.salt = undefined;
    user.hashed_password = undefined;

    //add user to profile property
    req.profile = user;
    next();
  });
};
