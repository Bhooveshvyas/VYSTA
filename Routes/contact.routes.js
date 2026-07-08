const express = require("express");
const router = express.Router();

const { createContact } = require("../Controller/contact.controller.js");
const { contactLimiter } = require("../Middleware/rateLimiter.middleware.js");

router.post("/", contactLimiter, createContact);

module.exports = router;