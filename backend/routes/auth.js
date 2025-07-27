const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  checkCODEligibility,
  verifyEmail
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  validatePasswordReset,
  validatePasswordUpdate,
  handleValidationErrors,
  sanitizeInput
} = require('../middleware/validation');

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', logout);
router.post('/forgotpassword', validatePasswordReset, handleValidationErrors, forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/refresh', refreshToken);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, validatePasswordUpdate, handleValidationErrors, updatePassword);
router.get('/cod-eligibility', protect, checkCODEligibility);

module.exports = router;
