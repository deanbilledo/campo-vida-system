const express = require('express');
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  assignDriver,
  getAllProducts,
  createProduct,
  updateProduct,
  updateProductStock,
  getAllCustomers,
  getSalesAnalytics
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');
const { 
  validateProduct,
  validateMongoId,
  validatePagination,
  handleValidationErrors,
  sanitizeInput
} = require('../middleware/validation');

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Order management
router.get('/orders', validatePagination, handleValidationErrors, getAllOrders);
router.put('/orders/:id/status', validateMongoId, handleValidationErrors, updateOrderStatus);
router.put('/orders/:id/assign-driver', validateMongoId, handleValidationErrors, assignDriver);

// Product management
router.route('/products')
  .get(validatePagination, handleValidationErrors, getAllProducts)
  .post(validateProduct, handleValidationErrors, createProduct);

router.put('/products/:id', validateMongoId, validateProduct, handleValidationErrors, updateProduct);
router.put('/products/:id/stock', validateMongoId, handleValidationErrors, updateProductStock);

// Customer management
router.get('/customers', validatePagination, handleValidationErrors, getAllCustomers);

// Analytics
router.get('/analytics/sales', getSalesAnalytics);

module.exports = router;
