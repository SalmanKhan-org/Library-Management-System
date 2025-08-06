const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/userModel");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.getUserDetails = catchAsyncErrors(
    async (req, res,next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        data: user
    });
}
)