const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    // Build query
    let query = { status: 'published', isVisible: true };

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Date filter - upcoming events only by default
    if (req.query.upcoming !== 'false') {
      query.startDate = { $gte: new Date() };
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.startDate = {};
      if (req.query.startDate) {
        query.startDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.startDate.$lte = new Date(req.query.endDate);
      }
    }

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case 'date':
        sort = { startDate: 1 };
        break;
      case '-date':
        sort = { startDate: -1 };
        break;
      case 'name':
        sort = { title: 1 };
        break;
      case '-name':
        sort = { title: -1 };
        break;
      case 'popularity':
        sort = { 'analytics.views': -1 };
        break;
      default:
        sort = { startDate: 1 };
    }

    // Execute query
    const events = await Event.find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .select('-adminNotes');

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    // Pagination info
    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    // Get categories for filters
    const categories = await Event.distinct('category', { status: 'published', isVisible: true });

    res.status(200).json({
      success: true,
      count: events.length,
      pagination,
      filters: {
        categories: categories.sort()
      },
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .select('-adminNotes');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'published' || !event.isVisible) {
      return res.status(404).json({
        success: false,
        message: 'Event is not available'
      });
    }

    // Increment view count
    await event.incrementViews();

    // Get related events (same category, excluding current event)
    const relatedEvents = await Event.find({
      category: event.category,
      status: 'published',
      isVisible: true,
      startDate: { $gte: new Date() },
      _id: { $ne: event._id }
    })
    .select('title shortDescription startDate startTime location category primaryImage registrationStatus')
    .limit(3);

    res.status(200).json({
      success: true,
      data: event,
      relatedEvents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
exports.getFeaturedEvents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    
    const events = await Event.getFeaturedEvents(limit);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
exports.getUpcomingEvents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const events = await Event.getUpcomingEvents(limit);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Public
exports.getEventsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const events = await Event.find({
      category,
      status: 'published',
      isVisible: true,
      startDate: { $gte: new Date() }
    })
    .sort({ startDate: 1 })
    .skip(startIndex)
    .limit(limit)
    .select('-adminNotes');

    const total = await Event.countDocuments({ 
      category, 
      status: 'published', 
      isVisible: true,
      startDate: { $gte: new Date() }
    });

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      category,
      count: events.length,
      pagination,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
exports.searchEvents = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Text search with scoring
    const events = await Event.find(
      {
        $text: { $search: q },
        status: 'published',
        isVisible: true,
        startDate: { $gte: new Date() }
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .skip(startIndex)
    .limit(limit)
    .select('-adminNotes');

    const total = await Event.countDocuments({
      $text: { $search: q },
      status: 'published',
      isVisible: true,
      startDate: { $gte: new Date() }
    });

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      query: q,
      count: events.length,
      pagination,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event categories
// @route   GET /api/events/categories
// @access  Public
exports.getEventCategories = async (req, res, next) => {
  try {
    const categories = await Event.aggregate([
      { $match: { status: 'published', isVisible: true, startDate: { $gte: new Date() } } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averageFee: { $avg: '$registration.fee' },
          minFee: { $min: '$registration.fee' },
          maxFee: { $max: '$registration.fee' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map(cat => ({
        name: cat._id,
        count: cat.count,
        feeRange: {
          min: cat.minFee || 0,
          max: cat.maxFee || 0,
          average: Math.round(cat.averageFee || 0)
        }
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event (placeholder for external integration)
// @route   POST /api/events/:id/register
// @access  Public
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.registrationStatus !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Registration is not available for this event'
      });
    }

    // Check if external registration URL is available
    if (event.externalLinks.registrationUrl) {
      return res.status(200).json({
        success: true,
        message: 'Please complete registration at the external link',
        registrationUrl: event.externalLinks.registrationUrl
      });
    }

    // For events without external registration, increment count
    if (event.registration.currentRegistrations >= event.registration.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    await event.addRegistration();

    res.status(200).json({
      success: true,
      message: 'Registration recorded successfully',
      data: {
        eventTitle: event.title,
        registrationCount: event.registration.currentRegistrations,
        capacity: event.registration.capacity
      }
    });
  } catch (error) {
    next(error);
  }
};
