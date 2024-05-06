const express = require("express");
const authController = require("../../controllers/v1/auth");
const authMiddleware = require("./../../middlewares/auth");
const registerValidatorSchema = require("./../../validators/register");
const joiValidatorMiddleware = require("./../../middlewares/joiValidator");

const router = express.Router();

router.post(
    "/register",
    joiValidatorMiddleware(registerValidatorSchema),
    authController.register
);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
