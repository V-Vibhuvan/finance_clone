const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const wrapAsync = require("../middleware/wrapAsync");
const AppError = require("../utils/AppError");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

module.exports.signup = wrapAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return next(new AppError("User already exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user
    });
});

module.exports.login = wrapAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new AppError("User not found", 404));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError("Invalid credentials", 401));

    res.json({
        success: true,
        token: generateToken(user._id),
        user
    });
});

module.exports.getProfile = wrapAsync(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
        success: true,
        user
    });
});