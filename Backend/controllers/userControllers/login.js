const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/userModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const bcrypt = require('bcryptjs');
const { generateToken } = require("../../utils/generateToken");

exports.login = catchAsyncErrors(
    async (req, res,next) => {
        const { email, password } = req.body;
        if (!email || !password) {
           return next(new ErrorHandler('Email and password are required', 400));
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorHandler('Incorrect Email or Password', 404));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ErrorHandler('Incorrect Email or Password', 401));
        }

        await generateToken(user,res, 200, 'Logged in successfully');
    }
)
