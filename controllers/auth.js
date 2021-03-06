const User = require("../models/user");
const { validationResult } = require("express-validator");
const { formatErrors } = require("../middlewares/validate");
const { sendEmailConfirmation } = require("../emails");
const jwt = require("jsonwebtoken"); //to genenerate a signed token
const expressJwt = require("express-jwt"); //for authorization check

exports.signup = (req, res) => {
  const errors = validationResult(req);
  const formattedErrors = formatErrors(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: formattedErrors });
  }

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) return res.status(400).json(err.message);

    //remove salt and hashed_password from user object
    user.salt = undefined;
    user.hashed_password = undefined;

    //generate a token for email verification
    const token = jwt.sign({ _id: user._id }, process.env.EMAIL_JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("token", token);

    const confirmationEmailLink = `http://localhost:3000/registration/email_confirmation/${token}`;

    //send confirmation email
    //temporary hard coded
    const msg = {
      to: "simonnguyen3054@gmail.com",
      from: "kins.simonnguyen@gmail.com",
      subject: "Confirm your email",
      html: `Please click this link to confirm your email: <a href="${confirmationEmailLink}">Verify Email</a>`,
    };
    sendEmailConfirmation(msg);

    res.json({ user });
  });
};

exports.emailConfirmation = (req, res, next, token) => {
  try {
    const user = jwt.verify(token, process.env.EMAIL_JWT_SECRET);
    User.findByIdAndUpdate(
      user._id,
      { email_confirmed: true },
      { new: true },
      (err, user) => {
        if (err) {
          res.status(403).json(err.message);
        }

        //add user to profile property
        req.profile = user;
        next();
      }
    );
  } catch (error) {
    res.status(403).json(error.message);
  }
};

exports.signin = (req, res) => {
  //find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please sign up.",
      });
    }

    //if user is found, make sure email and password match
    //use authenticate method in user model to check
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password don't match.",
      });
    }

    if (!user.email_confirmed) {
      return res.status(403).json({
        error: "Please confirm your email.",
      });
    }

    //generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.SIGNIN_JWT_SECRET);
    //persist the token as "t" in cookie with expiry date
    res.cookie("token", token, {
      expire: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    }); //set cookies to expire in 24 hours

    //return response with user and token to frontend client
    const { _id, first_name, last_name, email } = user;
    return res.json({ token, user: { _id, email, first_name, last_name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Sign out success" });
};

//check that user is signed in with the help of expressJwt
//req.auth gives the profile of the user that's signed in
//The decoded JWT payload is available on the request via the user property. This can be configured using the requestProperty
exports.requireSignin = expressJwt({
  secret: process.env.SIGNIN_JWT_SECRET,
  userProperty: "auth",
});

//check if user is authorized
exports.isAuth = (req, res, next) => {
  //req.profile is the user that found from param userId
  //req.auth is the signed-in user profile

  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};
