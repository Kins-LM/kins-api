const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/user/:userId", requireSignin, isAuth, (req, res) => {
  res.json({
    user: req.profile,
  });
});

//find the user by userId
router.param("userId", userById);

module.exports = router;
