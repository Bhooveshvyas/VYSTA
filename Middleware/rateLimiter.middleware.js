const createTokenBucketLimiter = require("./tokenBucket.middleware.js");

const loginLimiter = createTokenBucketLimiter({
    capacity: 5,              // max 5 requests burst
    refillRate: 5,            // refill 5 tokens
    refillIntervalMs: 15 * 60 * 1000, // every 15 min
    message: "Too many login attempts, try later",
});

const registerLimiter = createTokenBucketLimiter({
    capacity: 10,
    refillRate: 10,
    refillIntervalMs: 60 * 60 * 1000, // every 1 hr
    message: "Too many registrations",
});

const contactLimiter = createTokenBucketLimiter({
    capacity: 20,
    refillRate: 20,
    refillIntervalMs: 15 * 60 * 1000,
    message: "Too many contact requests",
});

const orderLimiter = createTokenBucketLimiter({
    capacity: 10,
    refillRate: 10,
    refillIntervalMs: 10 * 60 * 1000,
    message: "Too many orders",
});

module.exports = {
    loginLimiter,
    registerLimiter,
    contactLimiter,
    orderLimiter,
};

/*
--- HOW TO USE IN YOUR ROUTES ---

const { loginLimiter, registerLimiter, contactLimiter, orderLimiter } = require("./rateLimiters");

app.post("/login", loginLimiter, loginController);
app.post("/register", registerLimiter, registerController);
app.post("/contact", contactLimiter, contactController);
app.post("/order", orderLimiter, orderController);
*/