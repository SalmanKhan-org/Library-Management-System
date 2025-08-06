const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const BorrowBook = require("../../models/borrowBookModel");
const User = require("../../models/userModel");

exports.getAllUsers = catchAsyncErrors(
    async (req, res, next) => {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            data: users
        });
    }
 );
