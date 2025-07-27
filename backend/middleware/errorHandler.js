const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    
    // Extract field name from error
    const field = Object.keys(err.keyValue)[0];
    if (field) {
      if (field === 'email') {
        message = 'Email address is already registered';
      } else if (field === 'phone') {
        message = 'Phone number is already registered';
      } else if (field === 'orderNumber') {
        message = 'Order number already exists';
      } else {
        message = `${field} already exists`;
      }
    }
    
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired';
    error = { message, statusCode: 401 };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size too large';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Too many files uploaded';
    error = { message, statusCode: 400 };
  }

  // Database connection errors
  if (err.name === 'MongooseServerSelectionError') {
    const message = 'Database connection failed';
    error = { message, statusCode: 500 };
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests, please try again later';
    error = { message, statusCode: 429 };
  }

  // Permission errors
  if (err.message && err.message.includes('permission')) {
    error = { message: 'Permission denied', statusCode: 403 };
  }

  // Business logic errors
  if (err.message === 'Insufficient stock available') {
    error = { message: err.message, statusCode: 400 };
  }

  if (err.message === 'Order slots full for today') {
    error = { message: err.message, statusCode: 400 };
  }

  if (err.message && err.message.includes('COD not available')) {
    error = { message: err.message, statusCode: 403 };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
};

module.exports = errorHandler;
