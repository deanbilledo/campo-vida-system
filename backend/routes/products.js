const express = require('express');
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getProductStock,
  checkAvailability,
  getCategories,
  getPriceRange
} = require('../controllers/productController');

const { optionalAuth } = require('../middleware/auth');
const { 
  validateMongoId,
  validatePagination,
  validateSearch,
  handleValidationErrors,
  sanitizeInput
} = require('../middleware/validation');

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// Public routes with optional authentication
router.get('/', optionalAuth, validatePagination, validateSearch, handleValidationErrors, getProducts);
router.get('/featured', optionalAuth, getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/price-range', getPriceRange);
router.get('/search', optionalAuth, validateSearch, handleValidationErrors, searchProducts);
router.post('/check-availability', checkAvailability);

// Category-specific routes
router.get('/category/:category', optionalAuth, validatePagination, handleValidationErrors, getProductsByCategory);

// Single product routes
router.get('/:id', optionalAuth, validateMongoId, handleValidationErrors, getProduct);
router.get('/:id/stock', validateMongoId, handleValidationErrors, getProductStock);

module.exports = router;
