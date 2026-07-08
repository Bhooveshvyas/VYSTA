const express = require('express');
const { getAdminStats } = require('../Controller/admin.controller.js');
const { protect } = require('../Middleware/auth.middleware.js');
const { admin } = require('../Middleware/admin.middleware.js');

const router = express.Router();

router.get('/', protect, admin, getAdminStats);

module.exports = router;
