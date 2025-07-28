const Post = require('../models/Post');
const mongoose = require('mongoose');

// @desc    Get all published posts (public)
// @route   GET /api/posts
// @access  Public
exports.getAllPosts = async (req, res, next) => {
  try {
    // Build query for published posts only
    let query = {
      status: 'published',
      isVisible: true,
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: { $exists: false } }
      ]
    };

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      query.categories = { $in: [req.query.category] };
    }

    // Type filter
    if (req.query.type && req.query.type !== 'all') {
      query.type = req.query.type;
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Search filter
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$and = [
        query.$and || {},
        {
          $or: [
            { title: searchRegex },
            { content: searchRegex },
            { excerpt: searchRegex },
            { tags: { $in: [searchRegex] } }
          ]
        }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case 'title':
        sort = { title: 1 };
        break;
      case 'views':
        sort = { views: -1 };
        break;
      case 'oldest':
        sort = { publishedAt: 1 };
        break;
      default:
        sort = { isPinned: -1, publishedAt: -1 };
    }

    // Execute query
    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .select('-content');

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    next(error);
  }
};

// @desc    Get single post by slug or ID (public)
// @route   GET /api/posts/:identifier
// @access  Public
exports.getPostBySlug = async (req, res, next) => {
  try {
    const identifier = req.params.identifier || req.params.slug;
    
    // Try to find by slug first, then by ID
    let post = await Post.findOne({
      $or: [
        { slug: identifier },
        { _id: mongoose.isValidObjectId(identifier) ? identifier : null }
      ],
      status: 'published',
      isVisible: true
    }).populate('author', 'name email bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    next(error);
  }
};

// @desc    Get featured posts (public)
// @route   GET /api/posts/featured
// @access  Public
exports.getFeaturedPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    
    const posts = await Post.find({
      status: 'published',
      isVisible: true,
      isFeatured: true,
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: { $exists: false } }
      ]
    })
    .populate('author', 'name')
    .sort({ isPinned: -1, publishedAt: -1 })
    .limit(limit)
    .select('-content');

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    next(error);
  }
};

// @desc    Get posts by category (public)
// @route   GET /api/posts/category/:category
// @access  Public
exports.getPostsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const query = {
      status: 'published',
      isVisible: true,
      categories: { $in: [category] },
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: { $exists: false } }
      ]
    };

    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort({ isPinned: -1, publishedAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .select('-content');

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      category,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    next(error);
  }
};

// @desc    Get recent posts (public)
// @route   GET /api/posts/recent
// @access  Public
exports.getRecentPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    
    const posts = await Post.find({
      status: 'published',
      isVisible: true,
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: { $exists: false } }
      ]
    })
    .populate('author', 'name')
    .sort({ publishedAt: -1 })
    .limit(limit)
    .select('-content');

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    next(error);
  }
};

// @desc    Get post categories (public)
// @route   GET /api/posts/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Post.aggregate([
      {
        $match: {
          status: 'published',
          isVisible: true
        }
      },
      {
        $unwind: '$categories'
      },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    next(error);
  }
};

// @desc    Search posts (public)
// @route   GET /api/posts/search
// @access  Public
exports.searchPosts = async (req, res, next) => {
  try {
    const searchQuery = req.query.q || req.query.search || '';
    
    if (!searchQuery.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Build search query
    const query = {
      status: 'published',
      isVisible: true,
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: { $exists: false } }
      ]
    };

    // Add search conditions
    if (searchQuery) {
      query.$and = [
        {
          $or: [
            { title: { $regex: req.query.search, $options: 'i' } },
            { content: { $regex: req.query.search, $options: 'i' } },
            { excerpt: { $regex: req.query.search, $options: 'i' } },
            { tags: { $in: [new RegExp(req.query.search, 'i')] } }
          ]
        }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case 'title':
        sort = { title: 1 };
        break;
      case 'views':
        sort = { views: -1 };
        break;
      case 'oldest':
        sort = { publishedAt: 1 };
        break;
      default:
        sort = { isPinned: -1, publishedAt: -1 };
    }

    // Execute query
    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .select('-content');

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      query: searchQuery,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      data: posts
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    next(error);
  }
};

// Track post view
exports.trackView = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await Post.findOne({
      $or: [
        { slug: slug },
        { _id: mongoose.isValidObjectId(slug) ? slug : null }
      ],
      status: 'published',
      isVisible: true
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    await Post.findByIdAndUpdate(post._id, {
      $inc: { views: 1 }
    });

    res.json({
      success: true,
      message: 'View tracked'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking view',
      error: error.message
    });
  }
};

// Like/unlike post
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findOne({
      _id: id,
      status: 'published',
      isVisible: true
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // For now, just increment likes (in a real app, you'd track user likes)
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      likes: updatedPost.likes || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message
    });
  }
};
