const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but user not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      // Check if user account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to multiple failed login attempts'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive && !user.isLocked) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid or expired, but continue without user
        console.log('Optional auth failed:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Check if user owns the resource or is admin
exports.checkOwnership = (resourceField = 'user') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Please log in.'
        });
      }

      // Super admin and admin can access any resource
      if (req.user.role === 'super_admin' || req.user.role === 'admin') {
        return next();
      }

      // For other users, check ownership
      const resourceId = req.params.id || req.params.userId || req.params.orderId;
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID not provided'
        });
      }

      // Check if the resource belongs to the user
      // This assumes the resource has a field that references the user
      if (req.user._id.toString() === resourceId) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });

    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error in ownership verification'
      });
    }
  };
};

// Rate limiting for sensitive operations
exports.sensitiveOperationLimit = (req, res, next) => {
  // This would typically use Redis for production
  // For now, we'll use a simple in-memory approach
  const clientIp = req.ip || req.connection.remoteAddress;
  const operation = req.route.path;
  
  // In production, implement proper rate limiting
  // For now, just log the attempt
  console.log(`Sensitive operation attempted: ${operation} from ${clientIp}`);
  
  next();
};

// Verify COD eligibility
exports.checkCODEligibility = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const paymentMethod = req.body.payment?.method || req.body.paymentMethod;
    
    if (paymentMethod === 'cod' && !req.user.codEligible) {
      return res.status(403).json({
        success: false,
        message: `COD is only available after completing ${process.env.MIN_GCASH_ORDERS_FOR_COD || 5} successful GCash orders. Current count: ${req.user.successfulGCashOrders}`,
        codEligible: false,
        requiredOrders: parseInt(process.env.MIN_GCASH_ORDERS_FOR_COD) || 5,
        currentOrders: req.user.successfulGCashOrders
      });
    }

    next();
  } catch (error) {
    console.error('COD eligibility check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in COD eligibility check'
    });
  }
};

// Business hours check
exports.checkBusinessHours = (req, res, next) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  const storeOpenHour = parseInt(process.env.STORE_OPEN_HOUR) || 8;
  const storeCloseHour = parseInt(process.env.STORE_CLOSE_HOUR) || 17;
  
  // Check if it's Sunday (day 0)
  if (currentDay === 0) {
    return res.status(400).json({
      success: false,
      message: 'Orders are not accepted on Sundays. Please place your order on Monday-Saturday.',
      businessHours: 'Monday-Saturday 8AM-5PM'
    });
  }
  
  // Check if outside business hours
  if (currentHour < storeOpenHour || currentHour >= storeCloseHour) {
    return res.status(400).json({
      success: false,
      message: 'Orders can only be placed during business hours.',
      businessHours: `Monday-Saturday ${storeOpenHour}AM-${storeCloseHour}PM`,
      currentTime: now.toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
    });
  }

  next();
};

// Order cutoff time check
exports.checkOrderCutoff = (req, res, next) => {
  const now = new Date();
  const currentHour = now.getHours();
  const cutoffHour = parseInt(process.env.ORDER_CUTOFF_HOUR) || 15; // 3PM
  
  if (currentHour >= cutoffHour) {
    return res.status(400).json({
      success: false,
      message: `Orders for next-day delivery must be placed before ${cutoffHour}:00 (3PM). Orders placed after this time will be scheduled for the following day.`,
      cutoffTime: `${cutoffHour}:00`,
      currentTime: now.toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
    });
  }

  next();
};

module.exports = {
  protect: exports.protect,
  authorize: exports.authorize,
  optionalAuth: exports.optionalAuth,
  checkOwnership: exports.checkOwnership,
  sensitiveOperationLimit: exports.sensitiveOperationLimit,
  checkCODEligibility: exports.checkCODEligibility,
  checkBusinessHours: exports.checkBusinessHours,
  checkOrderCutoff: exports.checkOrderCutoff
};
