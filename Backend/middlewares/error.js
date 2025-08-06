exports.error = (err, req, res, next) => {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Handle specific known error types
  let message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    err.statusCode = 400;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
    err.statusCode = 400;
  }

  // Duplicate key error (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value: ${field}`;
    err.statusCode = 400;
  }

  // JWT error: invalid token
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token, please login again';
    err.statusCode = 401;
  }

  // JWT error: token expired
  if (err.name === 'TokenExpiredError') {
    message = 'Your session has expired. Please login again.';
    err.statusCode = 401;
  }

  // Send response
  res.status(err.statusCode).json({
    success: false,
    message
  });
};
