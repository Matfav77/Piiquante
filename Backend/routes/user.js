const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/user")

router.post("/signup", authCtrl.signup);

module.exports = router;