const buckets = new Map();

function createTokenBucketLimiter({ capacity, refillRate, refillIntervalMs, message }) {
    // capacity: max tokens (burst size)
    // refillRate: tokens added per interval
    // refillIntervalMs: how often tokens refill
    // message: error message when limit exceeded

    return function (req, res, next) {
        const key = req.ip; // req.user.id use kr skta hai if logged in

        let bucket = buckets.get(key);

        if (!bucket) {
            bucket = { tokens: capacity, lastRefill: Date.now() };
            buckets.set(key, bucket);
        }
        console.log(key, "tokens before:", bucket.tokens);

        // Refill logic
        const now = Date.now();
        const elapsed = now - bucket.lastRefill;
        const refillCount = Math.floor(elapsed / refillIntervalMs) * refillRate;

        if (refillCount > 0) {
            bucket.tokens = Math.min(capacity, bucket.tokens + refillCount);
            bucket.lastRefill = now;
        }

        if (bucket.tokens > 0) {
            bucket.tokens -= 1;
            next();
        } else {
            res.status(429).json({ message: message || "Too many requests, try later" });
        }
    };
}

// ---- Cleanup old unused buckets every 30 min (prevents memory leak) ----
setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
        if (now - bucket.lastRefill > 60 * 60 * 1000) {
            buckets.delete(key);
        }
    }
}, 30 * 60 * 1000);

module.exports = createTokenBucketLimiter;