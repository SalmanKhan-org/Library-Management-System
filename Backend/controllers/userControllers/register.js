const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/userModel");
const { generateToken } = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.registerUser = catchAsyncErrors(
    async (req, res,next) => {

        const { firstName, lastName, email, password, phoneNo,address } = req.body;
        if (!firstName || !lastName || !email || !password ||!phoneNo ||!address) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        const hashPassword = await bcrypt.hash(password, 10);

        let updatedPhoneNo = "+91"+phoneNo;

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            phoneNo:updatedPhoneNo,
            address
        });

        await generateToken(newUser, res, 201, 'User registered successfully');

    }
)