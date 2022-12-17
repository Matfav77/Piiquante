const express = require("express");
const sauceCtrl = require("../controllers/sauce");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");


router.get("/", sauceCtrl.getAllSauces);
router.post("/", auth, multer, sauceCtrl.createSauce)
router.get("/:id", sauceCtrl.getOneSauce)
router.put("/:id", auth, multer, sauceCtrl.modifySauce)
router.delete("/:id", auth, sauceCtrl.deleteSauce)



module.exports = router;
