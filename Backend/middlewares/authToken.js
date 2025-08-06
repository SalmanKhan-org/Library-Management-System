const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/ErrorHandler");

exports.authenticateToken = async (req, res, next) => {
  const token =  req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Login to access this resource' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new ErrorHandler('Server Error', 500));
    }
  });
};


exports.isLibrarian = (req,res,next)=>{
  if(!req.user || req.user.role !== 'librarian'){
    return res.status(403).json({
      success:false,
      message:"Access Denied"
    })
  }
  next();
}


exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
}