const express = require('express');
const {
  getDriverDashboard,
  getDeliveries,
  getDelivery,
  updateDeliveryStatus,
  addDeliveryProof,
  updateAvailability,
  getPerformanceStats,
  getEarnings
} = require('../controllers/driverController');

const { protect, authorize } = require('../middleware/auth');
const { 
  validateMongoId,
  handleValidationErrors,
  sanitizeInput
} = require('../middleware/validation');

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// All routes are protected and require driver role
router.use(protect);
router.use(authorize('driver', 'admin', 'super_admin'));

// Driver dashboard
router.get('/dashboard', getDriverDashboard);

// Delivery management
router.get('/deliveries', getDeliveries);
router.get('/deliveries/:id', validateMongoId, handleValidationErrors, getDelivery);
router.put('/deliveries/:id/status', validateMongoId, handleValidationErrors, updateDeliveryStatus);
router.post('/deliveries/:id/proof', validateMongoId, handleValidationErrors, addDeliveryProof);

// Driver status
router.put('/availability', updateAvailability);

// Performance and earnings
router.get('/performance', getPerformanceStats);
router.get('/earnings', getEarnings);

module.exports = router;
