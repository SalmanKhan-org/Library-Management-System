const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.getMyDetails = catchAsyncErrors(
    async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user
    });
}
)