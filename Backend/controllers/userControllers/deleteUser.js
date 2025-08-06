const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/userModel");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.deleteUser = catchAsyncErrors(
    async (req, res,next) => {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        await user.remove();
        res.json({
            success: true,
            message: 'User deleted successfully.'
        });
    }
)