const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Realiza o login.
router.post("/login", authController.login);

module.exports = router;