const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => {
      extractedErrors[err.path] = err.msg;
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: extractedErrors
    });
  }
  
  next();
};

// User validation rules
exports.validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
    
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
    
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('phone')
    .matches(/^(\+63|0)?9\d{9}$/)
    .withMessage('Please provide a valid Philippine phone number'),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required')
    .isLength({ max: 200 })
    .withMessage('Street address cannot be more than 200 characters'),
    
  body('address.barangay')
    .trim()
    .notEmpty()
    .withMessage('Barangay is required')
    .isLength({ max: 100 })
    .withMessage('Barangay cannot be more than 100 characters'),
    
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City cannot be more than 100 characters'),
    
  body('address.province')
    .trim()
    .notEmpty()
    .withMessage('Province is required')
    .isLength({ max: 100 })
    .withMessage('Province cannot be more than 100 characters'),
    
  body('address.zipCode')
    .matches(/^\d{4}$/)
    .withMessage('Please provide a valid 4-digit ZIP code')
];

exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

exports.validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

exports.validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Product validation rules
exports.validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot be more than 100 characters'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
    
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => {
      if (value < 0) {
        throw new Error('Price cannot be negative');
      }
      return true;
    }),
    
  body('category')
    .isIn(['Chips', 'Juices', 'Milk', 'Supplements', 'Fruits', 'Vegetables', 'Herbs', 'Nuts', 'Other'])
    .withMessage('Please select a valid category'),
    
  body('stock.quantity')
    .isNumeric()
    .withMessage('Stock quantity must be a number')
    .custom(value => {
      if (value < 0) {
        throw new Error('Stock quantity cannot be negative');
      }
      return true;
    })
];

// Order validation rules
exports.validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
    
  body('items.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
    
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
    
  body('deliveryInfo.type')
    .isIn(['pickup', 'delivery'])
    .withMessage('Delivery type must be either pickup or delivery'),
    
  body('deliveryInfo.preferredDate')
    .isISO8601()
    .withMessage('Please provide a valid preferred date')
    .custom(value => {
      const date = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      if (date < tomorrow) {
        throw new Error('Preferred date must be at least tomorrow');
      }
      return true;
    }),
    
  body('payment.method')
    .isIn(['gcash', 'cod'])
    .withMessage('Payment method must be either gcash or cod'),
    
  // Conditional validation for delivery address
  body('deliveryInfo.address.street')
    .if(body('deliveryInfo.type').equals('delivery'))
    .notEmpty()
    .withMessage('Street address is required for delivery orders'),
    
  body('deliveryInfo.address.barangay')
    .if(body('deliveryInfo.type').equals('delivery'))
    .notEmpty()
    .withMessage('Barangay is required for delivery orders'),
    
  body('deliveryInfo.address.city')
    .if(body('deliveryInfo.type').equals('delivery'))
    .notEmpty()
    .withMessage('City is required for delivery orders'),
    
  // Conditional validation for GCash payment
  body('payment.referenceNumber')
    .if(body('payment.method').equals('gcash'))
    .notEmpty()
    .withMessage('Reference number is required for GCash payments')
    .isLength({ min: 8, max: 20 })
    .withMessage('Reference number must be between 8 and 20 characters')
];

// Event validation rules
exports.validateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
    
  body('category')
    .isIn(['Workshop', 'Product Launch', 'Health Seminar', 'Cooking Class', 'Wellness Talk', 'Community Event', 'Other'])
    .withMessage('Please select a valid event category'),
    
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date')
    .custom(value => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
    
  body('endDate')
    .isISO8601()
    .withMessage('Please provide a valid end date')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      
      if (endDate < startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
    
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid start time (HH:MM format)'),
    
  body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid end time (HH:MM format)'),
    
  body('location.venue')
    .trim()
    .notEmpty()
    .withMessage('Venue is required')
    .isLength({ max: 200 })
    .withMessage('Venue cannot be more than 200 characters'),
    
  body('organizer.name')
    .trim()
    .notEmpty()
    .withMessage('Organizer name is required'),
    
  body('organizer.email')
    .isEmail()
    .withMessage('Please provide a valid organizer email')
    .normalizeEmail(),
    
  body('registration.capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
    
  body('registration.fee')
    .optional()
    .isNumeric()
    .withMessage('Fee must be a number')
    .custom(value => {
      if (value < 0) {
        throw new Error('Fee cannot be negative');
      }
      return true;
    })
];

// Common parameter validations
exports.validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'name', '-name', 'price', '-price', 'popularity', '-popularity'])
    .withMessage('Invalid sort parameter')
];

// Search validation
exports.validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
    
  query('category')
    .optional()
    .isIn(['Chips', 'Juices', 'Milk', 'Supplements', 'Fruits', 'Vegetables', 'Herbs', 'Nuts', 'Other'])
    .withMessage('Invalid category'),
    
  query('minPrice')
    .optional()
    .isNumeric()
    .withMessage('Minimum price must be a number'),
    
  query('maxPrice')
    .optional()
    .isNumeric()
    .withMessage('Maximum price must be a number')
    .custom((value, { req }) => {
      if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
        throw new Error('Maximum price must be greater than minimum price');
      }
      return true;
    })
];

// File upload validation
exports.validateFileUpload = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const file = req.files.file || req.files.image;
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB default

  if (file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: `File size too large. Maximum size is ${maxSize / 1024 / 1024}MB`
    });
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed'
    });
  }

  next();
};

// Custom sanitization middleware
exports.sanitizeInput = (req, res, next) => {
  // Remove any potentially harmful characters
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove script tags and other potentially harmful content
        obj[key] = obj[key]
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

module.exports = {
  handleValidationErrors: exports.handleValidationErrors,
  validateRegister: exports.validateRegister,
  validateLogin: exports.validateLogin,
  validatePasswordReset: exports.validatePasswordReset,
  validatePasswordUpdate: exports.validatePasswordUpdate,
  validateProduct: exports.validateProduct,
  validateOrder: exports.validateOrder,
  validateEvent: exports.validateEvent,
  validateMongoId: exports.validateMongoId,
  validatePagination: exports.validatePagination,
  validateSearch: exports.validateSearch,
  validateFileUpload: exports.validateFileUpload,
  sanitizeInput: exports.sanitizeInput
};
