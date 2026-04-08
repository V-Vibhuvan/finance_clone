const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("Not authorized, token missing", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        next(new AppError("Invalid token", 403));
    }
};

module.exports = protect;