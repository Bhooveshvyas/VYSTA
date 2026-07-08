const express = require('express');
const { registerUser, logoutUser, loginUser, getUsers, profile, changePassword} = require('../Controller/auth.controller.js');
const { protect } = require('../Middleware/auth.middleware.js');
const { admin } = require('../Middleware/admin.middleware.js');
const { registerLimiter, loginLimiter } = require('../Middleware/rateLimiter.middleware.js');
const router = express.Router();

router.post('/register', registerLimiter, registerUser);
router.post('/login', loginLimiter, loginUser);
router.post("/logout", logoutUser);

router.get("/profile", protect, profile);
router.post("/change-password", protect, changePassword);

router.get('/users', protect, admin, getUsers);

module.exports = router;