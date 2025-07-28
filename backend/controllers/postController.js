const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get all posts (admin)
// @route   GET /api/admin/posts
// @access  Private (Admin)
exports.getAllPosts = async (req, res, next) => {
  try {
    // Build query
    let query = {};

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Author filter
    if (req.query.author) {
      query.author = req.query.author;
    }

    // Search functionality
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Sort
    const sort = {};
    switch (req.query.sort) {
      case 'title':
        sort.title = 1;
        break;
      case 'date':
        sort.publishedAt = -1;
        break;
      case 'views':
        sort.views = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort(sort)
      .skip(startIndex)
      .limit(limit);

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

// @desc    Get single post (admin)
// @route   GET /api/admin/posts/:id
// @access  Private (Admin)
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

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

// @desc    Create new post
// @route   POST /api/admin/posts
// @access  Private (Admin)
exports.createPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      excerpt,
      type,
      category,
      tags,
      featuredImage,
      images,
      status,
      scheduledFor,
      isVisible,
      isFeatured,
      isPinned,
      metaDescription,
      sections
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        errors: {
          title: !title ? 'Post title is required' : null,
          content: !content ? 'Post content is required' : null,
          category: !category ? 'Post category is required' : null
        }
      });
    }

    // Create post data
    // Generate author name safely
    let authorName = 'Admin User'; // Default fallback
    if (req.user.firstName && req.user.lastName) {
      authorName = `${req.user.firstName} ${req.user.lastName}`;
    } else if (req.user.firstName) {
      authorName = req.user.firstName;
    } else if (req.user.email) {
      authorName = req.user.email.split('@')[0]; // Use email username as fallback
    }

    const postData = {
      title,
      content,
      excerpt,
      type: type || 'blog',
      category: category || 'Other',
      tags: tags || [],
      status: status || 'draft',
      isVisible: isVisible !== false,
      isFeatured: isFeatured || false,
      isPinned: isPinned || false,
      author: req.user._id,
      authorName,
      metaDescription,
      sections: sections || []
    };

    // Add featured image if provided
    if (featuredImage && featuredImage.url) {
      postData.featuredImage = featuredImage;
    }

    // Add images if provided
    if (images && Array.isArray(images)) {
      console.log('Post Controller: Received images array:', images);
      postData.images = images;
    } else {
      console.log('Post Controller: No images or invalid images array:', images);
    }

    // Add scheduled date if provided
    if (scheduledFor) {
      postData.scheduledFor = new Date(scheduledFor);
    }

    console.log('Post Controller: Creating post with data:', JSON.stringify(postData, null, 2));

    const post = await Post.create(postData);
    await post.populate('author', 'name email');

    console.log('Post Controller: Created post with images:', post.images);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Post creation error:', error);
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/admin/posts/:id
// @access  Private (Admin)
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Update fields
    const allowedFields = [
      'title', 'content', 'excerpt', 'type', 'category', 'tags',
      'featuredImage', 'images', 'status', 'scheduledFor', 'isVisible',
      'isFeatured', 'isPinned', 'metaDescription', 'sections'
    ];

    console.log('Post Controller Update: Received body:', JSON.stringify(req.body, null, 2));

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'images') {
          console.log('Post Controller Update: Setting images:', req.body[field]);
        }
        post[field] = req.body[field];
      }
    });

    console.log('Post Controller Update: About to save post with images:', post.images);

    await post.save();
    await post.populate('author', 'name email');

    console.log('Post Controller Update: Saved post with images:', post.images);

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Post update error:', error);
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/admin/posts/:id
// @access  Private (Admin)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Post deletion error:', error);
    next(error);
  }
};

// @desc    Bulk update post status
// @route   PATCH /api/admin/posts/bulk-status
// @access  Private (Admin)
exports.bulkUpdateStatus = async (req, res, next) => {
  try {
    const { postIds, status } = req.body;

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Post IDs are required'
      });
    }

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const result = await Post.updateMany(
      { _id: { $in: postIds } },
      { 
        status,
        ...(status === 'published' && { publishedAt: new Date() })
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} posts updated successfully`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    next(error);
  }
};

// @desc    Get post analytics
// @route   GET /api/admin/posts/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    const stats = await Promise.all([
      Post.countDocuments({ status: 'published' }),
      Post.countDocuments({ status: 'draft' }),
      Post.countDocuments({ status: 'archived' }),
      Post.countDocuments({ isFeatured: true, status: 'published' }),
      Post.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]),
      Post.find({ status: 'published' })
        .sort({ views: -1 })
        .limit(5)
        .select('title views slug')
    ]);

    res.json({
      success: true,
      data: {
        published: stats[0],
        drafts: stats[1],
        archived: stats[2],
        featured: stats[3],
        totalViews: stats[4][0]?.totalViews || 0,
        topPosts: stats[5]
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    next(error);
  }
};
