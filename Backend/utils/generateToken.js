
const jwt = require('jsonwebtoken');
exports.generateToken = (user, res, statusCode, message) => {
    // Create a token with the user's id and expiration date
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 1* 60 * 60 * 1000, // 1 hour
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(statusCode).json({ success: true, message: message });
}