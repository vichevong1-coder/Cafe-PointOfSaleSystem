const express = require("express");
const router = express.Router();
const { register, login, loginWithPin, getme } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/register", protect, adminOnly, register);
router.post("/login", login);
router.post("/login/pin", loginWithPin);
router.get("/me", protect, getme);

module.exports = router;