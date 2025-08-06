const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/userModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const jwt = require("jsonwebtoken");

exports.refreshAccessToken = catchAsyncErrors(
  async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new ErrorHandler('No refresh token provided', 401));
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return next(new ErrorHandler('Invalid refresh token', 403));

      const user = await User.findById(decoded.id);
      if (!user) return next(new ErrorHandler('User not found', 404));
      const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', newAccessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
      });

      return next(new ErrorHandler('Access token refreshed successfully', 200));
    });
  });