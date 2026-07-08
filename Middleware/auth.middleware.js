const jwt = require('jsonwebtoken');
const prisma = require('../Config/db.js');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            // console.log(req.headers.authorization);
            token = req.headers.authorization.split(' ')[1];
            const blacklisted = await prisma.blacklistedToken.findUnique({
                where: {
                    token
                }
            });

            if (blacklisted) {
                return res.status(401).json({
                    message: "Token has been revoked. Please login again."
                });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            });


            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                message: "Not authorized, token failed",
                error: error.message
            });
        }
    }

    if (!token) {
        console.log(token);

        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };