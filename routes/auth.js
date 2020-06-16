const express = require("express");
const router = express.Router();

const { userSignupValidationRules } = require("../middlewares/validate");
const { signup, signin, signout } = require("../controllers/auth");

router.post("/signup", userSignupValidationRules(), signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
