const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");

exports.logout = catchAsyncErrors(
    async (req, res,next) => {
        res.cookie('token', null, { expires: new Date(0) });

        res.status(200).json({ success: true, message: 'Logged out successfully.' });
    }
)