const express = require("express");
const router = express.Router();

const { userSignupValidationRules } = require("../middlewares/validate");
const { signup, signin, signout, emailConfirmation } = require("../controllers/auth");

router.post("/signup", userSignupValidationRules(), signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get("/email_confirmation/:email_token", (req, res) => {
  res.json({
    emailConfirmed: req.profile.email_confirmed,
  });
})
router.param("email_token", emailConfirmation);


module.exports = router;
