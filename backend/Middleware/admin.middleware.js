const admin = (req, res, next) => {
    if (req.user.role && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
module.exports = { admin };
