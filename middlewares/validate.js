const { check } = require("express-validator");

const userSignupValidationRules = () => {
  return [
    check("first_name").notEmpty().withMessage("First name cannot be empty"),
    check("last_name").notEmpty().withMessage("Last name cannot be empty"),
    check("email").isEmail(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must contain at least six characters")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[a-zA-Z]/)
      .withMessage("Password must contain a number")
      .matches(/[#?!@$%^&*-]/)
      .withMessage(
        "Password must contain at least one of these characters: #?!@$%^&*-"
      ),
  ];
};

const formatErrors = (errors) => {
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return extractedErrors;
};

module.exports = {
  userSignupValidationRules,
  formatErrors,
};
