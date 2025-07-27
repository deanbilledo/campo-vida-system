const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  trackOrder,
  submitFeedback,
  getOrderStats
} = require('../controllers/orderController');

const { protect, checkCODEligibility, checkBusinessHours } = require('../middleware/auth');
const { 
  validateOrder,
  validateMongoId,
  validatePagination,
  handleValidationErrors,
  sanitizeInput
} = require('../middleware/validation');

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// All routes are protected
router.use(protect);

// Order management routes
router.route('/')
  .get(validatePagination, handleValidationErrors, getMyOrders)
  .post(checkBusinessHours, checkCODEligibility, validateOrder, handleValidationErrors, createOrder);

// Order statistics
router.get('/stats', getOrderStats);

// Individual order routes
router.get('/:id', validateMongoId, handleValidationErrors, getOrder);
router.put('/:id/cancel', validateMongoId, handleValidationErrors, cancelOrder);
router.get('/:id/track', validateMongoId, handleValidationErrors, trackOrder);
router.post('/:id/feedback', validateMongoId, handleValidationErrors, submitFeedback);

module.exports = router;
