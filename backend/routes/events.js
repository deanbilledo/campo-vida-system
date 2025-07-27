const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getEvents,
  getEvent,
  getFeaturedEvents,
  getUpcomingEvents,
  getEventsByCategory,
  searchEvents,
  getEventCategories,
  registerForEvent
} = require('../controllers/eventController');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getEvents);

// @route   GET /api/events/featured
// @desc    Get featured events
// @access  Public
router.get('/featured', getFeaturedEvents);

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', getUpcomingEvents);

// @route   GET /api/events/search
// @desc    Search events
// @access  Public
router.get('/search', searchEvents);

// @route   GET /api/events/categories
// @desc    Get event categories
// @access  Public
router.get('/categories', getEventCategories);

// @route   GET /api/events/category/:category
// @desc    Get events by category
// @access  Public
router.get('/category/:category', getEventsByCategory);

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', getEvent);

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Public
router.post('/:id/register', registerForEvent);

module.exports = router;
