const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/user")

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login)

module.exports = router;